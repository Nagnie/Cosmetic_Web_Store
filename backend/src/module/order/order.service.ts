import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';
import { Image } from '../image/entities/image.entity';

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

  async findOne(orderId: number, req: Request) {
    try {
      const { page = 1, limit = 5} = req.query;
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId
        }
      });
      const allOrderDetails = await this.orderDetailRepository.find({
        where: {
          order
        },
        take: (limit as number),
        skip: ((page as number) - 1) * (limit as number),
        relations: ["product"]
      });
      const idPros = allOrderDetails.flatMap(item => item.product.id_pro);
      const images = await this.imageRepository.find({
        where: {
          product: In(idPros)
        },
        relations: ["product"]
      });
      allOrderDetails.forEach(item => {
        item.product.images = images.filter(image => image.product.id_pro === item.product.id_pro);
      });
      return new ResponseDto(HttpStatus.OK, "Successfully", { allPage: Math.ceil(allOrderDetails.length / (limit as number)), allOrderDetails })
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
