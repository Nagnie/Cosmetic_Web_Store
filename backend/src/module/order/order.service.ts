import { HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly dataSource: DataSource
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

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
