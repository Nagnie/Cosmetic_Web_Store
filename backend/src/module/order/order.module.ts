import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
