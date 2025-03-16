import { HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';

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
      const status = "not_ordered";
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
      const orders = await this.orderRepository.find({
        order: { [(sortBy as string).toLowerCase()]: order },
        take: (limit as unknown as number),
        skip: ((page as unknown as number) - 1) * (limit as unknown as number)
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", { allPage: Math.ceil(allItems / (limit as number)), orders })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const { page = 1, limit = 5, sortBy = "id", order = "ASC" } = req.query;
      const allItems = await this.orderRepository.count();
      const orders = await this.orderRepository.find({
        where: {
          id
        },
        order: { [(sortBy as string).toLowerCase()]: order },
        take: (limit as unknown as number),
        skip: ((page as unknown as number) - 1) * (limit as unknown as number)
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", { allPage: Math.ceil(allItems / (limit as number)), orders })
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
    const { name, email, phone, address, note, order_items, total_price } = createOrderDto;

    const width = 800, height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Tiêu đề (căn giữa, font Roboto, màu xanh)
    ctx.fillStyle = '#007BFF';
    ctx.font = 'bold 28px Roboto';
    const title = 'ĐẶT HÀNG THÀNH CÔNG!';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (width - titleWidth) / 2, 50);

    // Khung chứa thông tin đơn hàng (bo góc)
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 80, width - 80, height - 160, 10);
    ctx.stroke();

    // Thông tin khách hàng
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Roboto';
    ctx.fillText('Thông tin đơn hàng:', 60, 110);

    ctx.fillStyle = '#666';
    ctx.font = '16px Roboto';
    ctx.fillText(`Họ và tên: ${name}`, 60, 140);
    ctx.fillText(`Số điện thoại: ${phone}`, 60, 170);
    ctx.fillText(`Địa chỉ: ${address}`, 60, 200);

    // Danh sách sản phẩm
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Roboto';
    ctx.fillText('Sản phẩm đã đặt:', 60, 240);

    ctx.fillStyle = '#666';
    ctx.font = '16px Roboto';
    let y = 270;
    order_items.forEach((item, index) => {
      ctx.fillText(`${index + 1}. ${item.pro_name} (x${item.quantity})`, 60, y);
      ctx.fillText(`${item.price}đ`, width - 160, y);
      y += 30;
    });

    // Tổng tiền (in đậm)
    ctx.fillStyle = '#333';
    ctx.font = 'bold 22px Roboto';
    ctx.fillText('Tổng cộng:', 60, y + 10);
    ctx.fillText(`${total_price}đ`, width - 160, y + 10);

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
