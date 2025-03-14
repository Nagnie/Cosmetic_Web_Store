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

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly dataSource: DataSource,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {

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
          INSERT INTO order_detail(order_id, pro_id, class_id, quantity, price)
          VALUES($1, $2, $3, $4, $5)
          RETURNING *;
          `, [id_order, item.id_pro, item.id_class, item.quantity, item.price]);
      }

      // COMMIT
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        message: `Order "${id_order}" and order detail created successfully`,
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
      const { page = 1, limit = 5} = req.query;
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
}
