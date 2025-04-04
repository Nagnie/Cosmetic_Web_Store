import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';
import { Image } from '../image/entities/image.entity';
import { OrderStatus } from './enum/order_status.enum';

import { cloudinary, setupCloudinary } from '@/config/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { createCanvas } from 'canvas';
import * as QRCode from 'qrcode';
import { OrderSortField } from './enum/order_sortfield.enum';

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(Order)
      private readonly orderRepository: Repository<Order>,
      @InjectRepository(OrderDetail)
      private readonly orderDetailRepository: Repository<OrderDetail>,
      private readonly dataSource: DataSource,
      @InjectRepository(Image)
      private readonly imageRepository: Repository<Image>,
      private readonly configService: ConfigService
  ) {
    setupCloudinary(this.configService);
  }

  async getListProduct(@Req() req: Request & { session: any }) {
    if (!req.session.cart || req.session.cart.length === 0) {
      return {
        message: "Empty cart",
        data: []
      }
    }

    const cartJson = JSON.stringify(req.session.cart);
    const data = await this.dataSource.query(
        `
          WITH cart_items AS (SELECT *
                              FROM jsonb_to_recordset($1::jsonb)
                                     AS x(id_pro INT, id_class INT, quantity INT, type TEXT))
          SELECT pro.id_pro     AS id,
                 pro.name       AS name,
                 class.id_class AS id_class,
                 class.name     AS class_name,
                 pro.price      AS price,
                 ci.quantity    AS quantity,
                 'product'      AS type,
                 COALESCE((SELECT json_agg(img.link)
                           FROM product_image AS img
                           WHERE img.id_pro = pro.id_pro), '[]' ::json
                 )              AS images,
                 COALESCE(
                     (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name))
                      FROM classification AS class
                      WHERE class.id_pro = pro.id_pro), '[]' ::json
                 )              AS classification
          FROM cart_items AS ci
                 JOIN product AS pro ON pro.id_pro = ci.id_pro
                 LEFT JOIN classification AS class ON class.id_class = ci.id_class
          WHERE ci.type = 'product'

          UNION ALL

          SELECT com.id_combo AS id,
                 com.name     AS name,
                 NULL         AS id_class,
                 NULL         AS class_name,
                 com.price    AS price,
                 ci.quantity  AS quantity,
                 'combo'      AS type,
                 COALESCE((SELECT json_agg(img.link)
                           FROM combo_image AS img
                           WHERE img.id_combo = com.id_combo), '[]' ::json
                 )            AS images,
                 NULL         AS classification
          FROM cart_items AS ci
                 JOIN combo AS com ON com.id_combo = ci.id_pro
          WHERE ci.type = 'combo'

          ORDER BY name ASC
        `,
        [cartJson]
    );

    return {
      data: data
    }
  }

  // TODO: Modify delete image in the future
  async create(@Req() req: Request & { session: any }, createOrderDto: CreateOrderDto) {
    const {name, email, phone, address, note, order_items, total_price} = createOrderDto;
    const queryRunner = this.dataSource.createQueryRunner();

    // START TRANSACTION
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT ORDER
      const status = OrderStatus.NOT_ORDERED;
      const insertOrder = await queryRunner.query(`
        INSERT INTO orders(customer, email, phone, address, status, sum_price, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `, [name, email, phone, address, status, total_price, note]);

      const id_order = insertOrder[0]?.id;

      // INSERT ORDER DETAIL
      for (const item of order_items) {
        await queryRunner.query(`
          INSERT INTO order_detail(order_id, pro_id, pro_name, pro_image, class_id, class_name, quantity, price, type)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `, [id_order, item.id_pro, item.pro_name, item.pro_image, item.id_class, item.class_name, item.quantity, item.price, item.type]);
      }

      // Create invoice's image
      const invoiceImagePath = await this.generateInvoiceImage(createOrderDto);

      // Create invoice's url
      const invoiceUrl = await this.uploadImageToCloudinary(invoiceImagePath);

      // Create QR code
      const qrCodePath = await this.generateQRCode(invoiceUrl.url, invoiceUrl.publicId);

      // Upload QR code
      const qrCodeUrl = await this.uploadImageToCloudinary(qrCodePath);

      // COMMIT
      await queryRunner.commitTransaction();

      // Delete session 
      req.session.destroy((err) => {
        if (err) {
          console.error('Lỗi khi xóa session:', err);
        }
      });

      return {
        statusCode: 201,
        message: `Order "${id_order}" and order detail created successfully`,
        invoice_url: invoiceUrl,
        qr_code_url: qrCodeUrl,
      }
    } catch (error) {
      // ROLL BACK
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create order');
    } finally {
      // CLOSE QUERYRUNNER
      await queryRunner.release();
    }
  }

  async findAll(req: Request) {
    try {
      const {page = 1, limit = 5, sortBy = "created_at", orderBy = "desc"} = req.query;
      const allItems = await this.orderRepository.count();
      const allPage = Math.ceil(allItems / (limit as number));
      const orders = await this.orderRepository.find({
        order: {[(sortBy as string).toLowerCase()]: orderBy},
        take: (limit as unknown as number),
        skip: ((page as unknown as number) - 1) * (limit as unknown as number)
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", {
        total_pages: allPage,
        total_items: allItems,
        page,
        limit,
        orders
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(orderId: number, req: Request) {
    try {
      const {page = 1, limit = 5} = req.query;

      const [items, totalItems] = await this.orderDetailRepository.findAndCount({
        where: {
          order: {
            id: orderId
          }
        },
        order: {id: "ASC"},
        take: (limit as number),
        skip: ((page as number) - 1) * (limit as number),
      });

      if (totalItems === 0) {
        throw new HttpException("Order does not exist", HttpStatus.BAD_REQUEST);
      }

      const allPage = Math.ceil(totalItems / (limit as number));
      return new ResponseDto(HttpStatus.OK, "Successfully", {
        total_pages: allPage,
        total_items: totalItems,
        page,
        limit,
        allProducts: items
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchAndFilter(req: Request) {
    const {
      key = "",
      status = "",
      page = 1,
      limit = 5,
      sortBy = "created_at",
      orderBy = "ASC"
    } = req.query;

    const take = isNaN(Number(limit)) ? 5 : Number(limit);
    const skip = (isNaN(Number(page)) || isNaN(Number(limit))) ? 0 : (Number(page) - 1) * Number(limit);
    const statusValid = Object.values(OrderStatus).filter((item) => item === (status as string).toLowerCase());
    const sortByValid = Object.values(OrderSortField).filter((item) => item === (sortBy as string).toLowerCase());

    const [items, totalItems] = await this.orderRepository.findAndCount({
      where: {
        customer: ILike(`%${key}%`),
        status: statusValid[0]
      },
      relations: ["orderDetails"],
      order: {
        [sortByValid[0]]: orderBy as string
      },
      take,
      skip
    });

    return new ResponseDto(HttpStatus.OK, "Successfully", {
      total_pages: Math.ceil(totalItems / take),
      total_items: totalItems,
      page,
      limit,
      data: items
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: {id}
      });

      if (!order) {
        throw new HttpException("Brand not found with id: " + id, HttpStatus.NOT_FOUND);
      }
      await this.orderRepository.update(id, updateOrderDto);

      return new ResponseDto(HttpStatus.OK, "Successfully", updateOrderDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: {id}
      });

      if (!order) {
        throw new HttpException("Order not found with id: " + id, HttpStatus.NOT_FOUND);
      }

      await this.orderRepository.delete(id);
      return new ResponseDto(200, "Delete order successfully", null);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async uploadImageToCloudinary(filePath: string): Promise<{ url: string, publicId: string }> {
    const deleteAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'invoices',
      use_filename: true,
      unique_filename: false,
      invalidate: true,
      expires_at: deleteAt,
    });
    fs.unlinkSync(filePath);
    return {url: result.secure_url, publicId: result.public_id};
  }

  // private async generateInvoiceImage(createOrderDto: CreateOrderDto): Promise<string> {
  //   const { name, phone, address, order_items, total_price } = createOrderDto;

  //   const width = 800, height = 550;
  //   const canvas = createCanvas(width, height);
  //   const ctx = canvas.getContext('2d');

  //   // Background
  //   ctx.fillStyle = '#f8f9fa'; // Màu nền nhạt
  //   ctx.fillRect(0, 0, width, height);

  //   // Tiêu đề (Màu đen, căn giữa, font to)
  //   ctx.fillStyle = '#222';
  //   ctx.font = 'bold 32px Arial';
  //   const title = 'HÓA ĐƠN ĐẶT HÀNG';
  //   const titleWidth = ctx.measureText(title).width;
  //   ctx.fillText(title, (width - titleWidth) / 2, 60);

  //   // Thông tin khách hàng
  //   ctx.fillStyle = '#333';
  //   ctx.font = 'bold 24px Arial';
  //   ctx.fillText('Thông tin khách hàng:', 50, 110);

  //   ctx.fillStyle = '#555';
  //   ctx.font = '22px Arial';
  //   ctx.fillText(`Họ và tên: ${name}`, 50, 150);
  //   ctx.fillText(`Số điện thoại: ${phone}`, 50, 180);
  //   ctx.fillText(`Địa chỉ: ${address}`, 50, 210);

  //   // Danh sách sản phẩm
  //   ctx.fillStyle = '#333';
  //   ctx.font = 'bold 24px Arial';
  //   ctx.fillText('Sản phẩm:', 50, 250);

  //   ctx.fillStyle = '#555';
  //   ctx.font = '22px Arial';
  //   let y = 290;
  //   order_items.forEach((item, index) => {
  //     ctx.fillText(`${index + 1}. ${item.pro_name} (x${item.quantity})`, 50, y);
  //     ctx.fillText(`${item.price}đ`, width - 160, y);
  //     y += 35;
  //   });

  //   // Dòng kẻ ngang ngăn cách
  //   ctx.strokeStyle = '#bbb';
  //   ctx.beginPath();
  //   ctx.moveTo(50, y + 10);
  //   ctx.lineTo(width - 50, y + 10);
  //   ctx.stroke();

  //   // Tổng tiền (nổi bật)
  //   ctx.fillStyle = '#222';
  //   ctx.font = 'bold 26px Arial';
  //   ctx.fillText('Tổng cộng:', 50, y + 50);
  //   ctx.fillText(`${total_price}đ`, width - 160, y + 50);

  //   // Lưu ảnh vào file tạm
  //   const filePath = `invoice_${Date.now()}.png`;
  //   const buffer = canvas.toBuffer('image/png');
  //   fs.writeFileSync(filePath, buffer);

  //   return filePath;
  // }

  private async generateInvoiceImage(createOrderDto: CreateOrderDto): Promise<string> {
    const {name, phone, address, order_items, total_price} = createOrderDto;

    const shipping_fee = 18000;

    // Calculate base width: 800 + (100 * additional items)
    const width = 800 + (Math.max(0, order_items.length - 1) * 100);
    const height = 600 + (order_items.length * 50); // Also adjust height slightly

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f8f9fa'; // Light background
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#222';
    ctx.font = 'bold 32px Arial';
    const title = 'HÓA ĐƠN ĐẶT HÀNG';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (width - titleWidth) / 2, 60);

    // Customer Information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Thông tin khách hàng:', 50, 110);

    ctx.fillStyle = '#555';
    ctx.font = '22px Arial';
    let y = 150;
    wrapText(ctx, `Họ và tên: ${name}`, 50, y, width - 100, 26);
    y += 40;
    wrapText(ctx, `Số điện thoại: ${phone}`, 50, y, width - 100, 26);
    y += 40;
    wrapText(ctx, `Địa chỉ: ${address}`, 50, y, width - 100, 26);
    y += 60;

    // Calculate original total price
    const original_total_price = order_items.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0);

    // Calculate discount
    const discount = original_total_price - total_price + shipping_fee;

    // Product List
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Sản phẩm:', 50, y);
    y += 35;

    ctx.fillStyle = '#555';
    ctx.font = '22px Arial';
    order_items.forEach((item, index) => {
      wrapText(ctx, `${index + 1}. ${item.pro_name} (x${item.quantity})`, 50, y, width - 290, 26);
      ctx.fillText(`${formatPrice(item.price)}đ`, width - 200, y);
      y += 50;
    });

    // Horizontal line
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    ctx.moveTo(50, y + 10);
    ctx.lineTo(width - 50, y + 10);
    ctx.stroke();
    y += 50;

    // Total calculations
    ctx.fillStyle = '#222';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Tổng cộng', 50, y);
    ctx.fillText(`${formatPrice(original_total_price)}đ`, width - 200, y);
    y += 35

    // Discount
    ctx.fillText('Giảm giá:', 50, y);
    ctx.fillText(`${formatPrice(discount)}đ`, width - 200, y);
    y += 35

    // Shipping fee
    ctx.fillText('Phí vận chuyển:', 50, y);
    ctx.fillText(`${formatPrice(shipping_fee)}đ`, width - 200, y);
    y += 40;

    // Total amount
    ctx.font = 'bold 26px Arial';
    ctx.fillText('Tổng tiền:', 50, y);
    ctx.fillText(`${formatPrice(total_price)}đ`, width - 200, y);

    // Save image to temporary file
    const filePath = `invoice_${Date.now()}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  private async generateQRCode(url: string, publicId: string): Promise<string> {
    const server = this.configService.get<String>("SERVERNAME");
    const downloadUrl = `${server}/api/order/download-invoice?url=${url}&publicId=${publicId}`;
    const qrPath = `qrcode_${Date.now()}.png`;
    await QRCode.toFile(qrPath, downloadUrl, { width: 300 });
    return qrPath;
  }
}

// 📝 Hàm tự động xuống dòng
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// 📝 Hàm định dạng tiền
function formatPrice(price) {
  return Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

