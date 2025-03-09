import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
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
  ) {
    
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll(req: Request) {
    try {
      const {page = 1, limit = 5, sortBy = "id", order = "ASC"} = req.query;
      const allItems = await this.orderRepository.count();
      const orders = await this.orderRepository.find({
        order: {[(sortBy as string).toLowerCase()]: order},
        take: (limit as unknown as number),
        skip: ((page as unknown as number) - 1) * (limit as unknown as number)
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", {allPage: Math.ceil(allItems / (limit as number)), orders})
    } catch (error) {
      throw new InternalServerErrorException(error.message);      
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const {page = 1, limit = 5, sortBy = "id", order = "ASC"} = req.query;
      const allItems = await this.orderRepository.count();
      const orders = await this.orderRepository.find({
        where: {
          id
        },
        order: {[(sortBy as string).toLowerCase()]: order},
        take: (limit as unknown as number),
        skip: ((page as unknown as number) - 1) * (limit as unknown as number)
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", {allPage: Math.ceil(allItems / (limit as number)), orders})
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
