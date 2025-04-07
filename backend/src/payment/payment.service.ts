import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
const PayOS = require("@payos/node");
import { CheckoutRequestType, CheckoutResponseDataType, WebhookDataType, WebhookType } from '@payos/node/lib/type';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@/module/order/entities/order.entity';
import { OrderService } from '@/module/order/order.service';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private payOS: any;
  private returnUrl: string;
  private cancelUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderService: OrderService,
  ) {
    const clientId = configService.get<string>("PAYOS_CLIENT_ID");
    const apiKey = configService.get<string>("PAYOS_API_KEY");
    const checksumKey = configService.get<string>("PAYOS_CHECKSUM_KEY");
    this.returnUrl = configService.get<string>("SERVERNAME") + "/payment-confirmation";
    this.cancelUrl = configService.get<string>("SERVERNAME") + "/payment-methods";
    this.payOS = new PayOS(
      clientId,
      apiKey,
      checksumKey
    );
  }

  async checkout(createPaymentDto: CreatePaymentDto, res: Response) {
    const checkoutRequest = await this.createPaymentRequest(createPaymentDto);
    const checkouResponse: CheckoutResponseDataType = await this.payOS.createPaymentLink(checkoutRequest);
    console.log(checkouResponse);
    //return res.redirect(303, checkouResponse.checkoutUrl);
  }

  async createPaymentRequest(createPaymentDto: CreatePaymentDto)  {
    const orderId = createPaymentDto.orderCode;
    try {
      const order = await this.orderService.getOrder(+orderId);
      const orderItems = this.handleItemsOrder(order);
      const paymentRequest = {
        orderCode: orderId,
        amount: order.sumPrice,
        description: "THANH TOAN DON HANG " + orderId,
        items: orderItems,
        returnUrl: this.returnUrl,
        cancelUrl: this.cancelUrl
      };

      return paymentRequest;
    } catch (error) {
      console.log(error.message);
    }

  }

  handleItemsOrder(order: Order) {
    const items = order.orderDetails.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    return items;
  }

  async getPaymentInfo(orderCode: number) {
    const paymentLink = await this.payOS.getPaymentLinkInformation(orderCode);
    return paymentLink;
  }

  async cancelPayment(orderCode: number) {
    const cancelledPaymentLink = await this.payOS.cancelPaymentLink(orderCode);
    return cancelledPaymentLink
  }

  async handlePaymentHook(req: Request, res: Response) {
    const paymentHookData: WebhookType = req.body;
    const isValidData = await this.payOS.verifyPaymentWebhookData(paymentHookData);

    if (!isValidData) {
      throw new InternalServerErrorException("Invalid data from PayOS");
    }
    console.log(paymentHookData);
    await this.paymentRepository.save(paymentHookData.data);
    return res.json();
  }
}
