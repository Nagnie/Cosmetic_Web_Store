import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '@/helpers/decorator/public';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Public()
  getCheckoutUrl() {
    return this.paymentService.getCheckoutUrl();
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
}
