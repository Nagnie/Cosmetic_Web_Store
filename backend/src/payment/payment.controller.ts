import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '@/helpers/decorator/public';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("checkout")
  @Public()
  checkout(@Body() body: CreatePaymentDto, @Res() res: Response) {
    return this.paymentService.checkout(body, res);
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
