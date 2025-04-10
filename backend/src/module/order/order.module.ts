import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { Image } from '../image/entities/image.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product]),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService],
  exports: [OrderService]
})
export class OrderModule {}
