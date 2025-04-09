import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '@/helpers/decorator/public';
import { Request, Response } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { CreateOrderDto } from '@/module/order/dto/create-order.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("checkout")
  @Public()
  @ApiBody({ type: CreateOrderDto })
  checkout(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    return this.paymentService.checkout(createOrderDto, res);
  }

  @Get("info/:orderCode")
  @Public()
  getPaymentInfo(@Param("orderCode") orderCode: number) {
    return this.paymentService.getPaymentInfo(orderCode);
  }

  @Get("cancel/:orderCode")
  @Public()
  cancelPayment(@Param("orderCode") orderCode: number) {
    return this.paymentService.cancelPayment(orderCode);
  }

  @Post("payment-hook")
  @Public()
  paymentReceiveHook(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.handlePaymentHook(req, res);
  }
}
