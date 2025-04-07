import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { OrderService } from '@/module/order/order.service';
import { Order } from '@/module/order/entities/order.entity';
import { OrderDetail } from '@/module/order/entities/order_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderDetail])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrderService],
})
export class PaymentModule {}
