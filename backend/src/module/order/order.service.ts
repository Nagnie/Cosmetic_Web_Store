import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';
import { Image } from '../image/entities/image.entity';
import { OrderStatus } from './order_status.enum';

import { cloudinary, setupCloudinary } from '@/config/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { createCanvas } from 'canvas';
import * as QRCode from 'qrcode';

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

  async create(@Req() req: Request & { session: any }, createOrderDto: CreateOrderDto) {
    const { name, email, phone, address, note, order_items, total_price } = createOrderDto;
    const queryRunner = this.dataSource.createQueryRunner();

    // START TRANSACTION
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT ORDER
      const status = OrderStatus.NOT_ORDERED;
      const insertOrder = await queryRunner.query(`
          INSERT INTO orders(customer, email, phone, address, status, sum_price, note)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `, [name, email, phone, address, status, total_price, note]);

      const id_order = insertOrder[0]?.id;

      // INSERT ORDER DETAIL
      for (const item of order_items) {
        await queryRunner.query(`
          INSERT INTO order_detail(order_id, pro_id, pro_name, pro_image, class_id, class_name, quantity, price)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
          `, [id_order, item.id_pro, item.pro_name, item.pro_image, item.id_class, item.class_name, item.quantity, item.price]);
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
      const { page = 1, limit = 5, sortBy = "id", order = "ASC" } = req.query;
      const allItems = await this.orderRepository.count();
      const allPage = Math.ceil(allItems / (limit as number));
      const orders = await this.orderRepository.find({
        order: { [(sortBy as string).toLowerCase()]: order },
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
      const { page = 1, limit = 5 } = req.query;
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId
        }
      });

      if (!order) {
        return new ResponseDto(HttpStatus.BAD_REQUEST, "Order not found", null);
      }

      const allOrderDetails = await this.orderDetailRepository.find({
        where: {
          order
        },
        order:{id: "ASC"},
        take: (limit as number),
        skip: ((page as number) - 1) * (limit as number),
      });
      const allPage = Math.ceil(allOrderDetails.length / (limit as number));
      // console.log(allOrderDetails);
      // const idPros = allOrderDetails.flatMap(item => item.product.id_pro);
      // const images = await this.imageRepository.find({
      //   where: {
      //     product: In(idPros)
      //   },
      //   relations: ["product"]
      // });
      // allOrderDetails.forEach(item => {
      //   item.product.images = images.filter(image => image.product.id_pro === item.product.id_pro);
      // });
      return new ResponseDto(HttpStatus.OK, "Successfully", {
        total_pages: allPage,
        total_items: allOrderDetails.length,
        page,
        limit,
        allProducts: allOrderDetails
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id }
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
        where: { id }
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
    return { url: result.secure_url, publicId: result.public_id };
  }

  private async generateInvoiceImage(createOrderDto: CreateOrderDto): Promise<string> {
    const { name, phone, address, order_items, total_price } = createOrderDto;

    const width = 800, height = 550;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f8f9fa'; // Màu nền nhạt
    ctx.fillRect(0, 0, width, height);

    // Tiêu đề (Màu đen, căn giữa, font to)
    ctx.fillStyle = '#222';
    ctx.font = 'bold 32px Arial';
    const title = 'HÓA ĐƠN ĐẶT HÀNG';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (width - titleWidth) / 2, 60);

    // Thông tin khách hàng
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Thông tin khách hàng:', 50, 110);

    ctx.fillStyle = '#555';
    ctx.font = '22px Arial';
    ctx.fillText(`Họ và tên: ${name}`, 50, 150);
    ctx.fillText(`Số điện thoại: ${phone}`, 50, 180);
    ctx.fillText(`Địa chỉ: ${address}`, 50, 210);

    // Danh sách sản phẩm
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Sản phẩm:', 50, 250);

    ctx.fillStyle = '#555';
    ctx.font = '22px Arial';
    let y = 290;
    order_items.forEach((item, index) => {
      ctx.fillText(`${index + 1}. ${item.pro_name} (x${item.quantity})`, 50, y);
      ctx.fillText(`${item.price}đ`, width - 160, y);
      y += 35;
    });

    // Dòng kẻ ngang ngăn cách
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    ctx.moveTo(50, y + 10);
    ctx.lineTo(width - 50, y + 10);
    ctx.stroke();

    // Tổng tiền (nổi bật)
    ctx.fillStyle = '#222';
    ctx.font = 'bold 26px Arial';
    ctx.fillText('Tổng cộng:', 50, y + 50);
    ctx.fillText(`${total_price}đ`, width - 160, y + 50);

    // Lưu ảnh vào file tạm
    const filePath = `invoice_${Date.now()}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }


  private async generateQRCode(url: string, publicId: string): Promise<string> {
    const downloadUrl = `http://localhost:3001/api/order/download-invoice?url=${url}&publicId=${publicId}`;
    const qrPath = `qrcode_${Date.now()}.png`;
    await QRCode.toFile(qrPath, downloadUrl, { width: 300 });
    return qrPath;
  }
}
