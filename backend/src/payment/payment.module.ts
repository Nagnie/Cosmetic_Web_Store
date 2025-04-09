import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { OrderService } from '@/module/order/order.service';
import { Order } from '@/module/order/entities/order.entity';
import { OrderDetail } from '@/module/order/entities/order_detail.entity';
import { Product } from '@/module/product/entities/product.entity';
import { ProductService } from '@/module/product/product.service';
import { RedisModule } from '@/redis/redis.module';
import { RedisService } from '@/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderDetail, Product,]),
    RedisModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrderService, ProductService, RedisService],
})
export class PaymentModule {}
