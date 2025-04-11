import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from '@/helpers/decorator/public';
import { Request, Response } from 'express';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '@/module/order/dto/create-order.dto';
import { ResponseDto } from '@/helpers/utils';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("checkout")
  @Public()
  @ApiOperation({ summary: 'Get checkout URL' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({status: 201, type: ResponseDto, description: "Data: checkoutUrl"})
  checkout(@Req() req: Request & { session: any }, @Body() createOrderDto: CreateOrderDto) {
    return this.paymentService.checkout(req, createOrderDto);
  }

  @Post("check")
  @Public()
  @ApiOperation({summary: "Check existed checkout"})
  @ApiBody({type: CreateOrderDto})
  @ApiResponse({status: 200, type: ResponseDto, description: "Data: checkoutUrl"})
  checkExistedCheckout(@Body() createOrderDto: CreateOrderDto) {
    return this.paymentService.checkExistedCheckout(createOrderDto);
  }

  @Get("info/:orderCode")
  @Public()
  @ApiOperation({summary: "Get info of payment"})
  @ApiParam({name: "orderCode", required: true, description: "order code"})
  getPaymentInfo(@Param("orderCode") orderCode: number) {
    return this.paymentService.getPaymentInfo(orderCode);
  }

  @Get("cancel/:orderCode")
  @Public()
  @ApiOperation({summary: "Cancel checkout payment"})
  @ApiParam({name: "orderCode", required: true, description: "Order code"})
  @ApiResponse({status: 200, description: "Info of payment"})
  cancelPayment(@Param("orderCode") orderCode: number) {
    return this.paymentService.cancelPayment(orderCode);
  }

  @Post("payment-hook")
  @Public()
  @ApiExcludeEndpoint()
  paymentReceiveHook(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.handlePaymentHook(req, res);
  }
}
