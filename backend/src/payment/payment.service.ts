import { Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
const PayOS = require("@payos/node");
import { CheckoutRequestType, CheckoutResponseDataType, WebhookDataType, WebhookType } from '@payos/node/lib/type';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from '@/module/order/order.service';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '@/module/order/dto/create-order.dto';
import { RedisService } from '@/redis/redis.service';

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
    private readonly redisService: RedisService
  ) {
    const clientId = configService.get<string>("PAYOS_CLIENT_ID");
    const apiKey = configService.get<string>("PAYOS_API_KEY");
    const checksumKey = configService.get<string>("PAYOS_CHECKSUM_KEY");
    this.returnUrl = configService.get<string>("SERVERNAME") + "/payment-confirmation";
    this.cancelUrl = configService.get<string>("SERVERNAME") + "/payment-confirmation";
    this.payOS = new PayOS(
      clientId,
      apiKey,
      checksumKey
    );
  }

  async checkout(@Req() req: Request & { session: any }, createOrderDto: CreateOrderDto, res: Response) {
    // const checkoutRequest = await this.createPaymentRequest(createPaymentDto);
    // const checkouResponse: CheckoutResponseDataType = await this.payOS.createPaymentLink(checkoutRequest);
    // console.log(checkouResponse);
    //return res.redirect(303, checkouResponse.checkoutUrl);
    // await this.orderService.getProductsFromOrderDto(createOrderDto);

    //check redis
    const uniqueOrderCode = this.createOrderKeyFromOrderDto(createOrderDto);
    const checkoutKey = "CHECKOUT" + uniqueOrderCode;
    const existedCheckout = await this.redisService.get(checkoutKey);

    if (existedCheckout) {
      return res.redirect(303, existedCheckout.checkoutUrl);
    }

    const paymentDto: CreatePaymentDto = await this.getPaymentDtoFromOrderDto(createOrderDto);
    const paymentRequest = this.createPaymentRequest(uniqueOrderCode, paymentDto);
    
    const orderKey = "ORDER" + uniqueOrderCode;
    await this.saveOrderToRedis(paymentRequest.orderCode, orderKey, createOrderDto);

    const checkoutInfo: CheckoutResponseDataType = await this.payOS.createPaymentLink(paymentRequest);
    this.savePaymentToRedis(paymentRequest.orderCode, checkoutKey, checkoutInfo);

    const sessionId = req.session.id;
    this.addSessionIdToOrderSet(paymentRequest.orderCode, sessionId);
    console.log(checkoutInfo);
    return res.redirect(checkoutInfo.checkoutUrl);
  }

  private createPaymentRequest(uniqueOrderCode: number, paymentDto: CreatePaymentDto): CheckoutRequestType {
    return {
      description: "THANH TOAN " + paymentDto.orderCode + String.fromCharCode(Math.floor(Math.random() * 26) + 65) + uniqueOrderCode,
      returnUrl: this.returnUrl,
      cancelUrl: this.cancelUrl,
      ...paymentDto,
    };
  }

  private async savePaymentToRedis(orderCode: number, checkoutKey: string, paymentInfo: CheckoutResponseDataType) {
    await this.redisService.set(checkoutKey, paymentInfo);
    await this.redisService.addToSet(String(orderCode), [checkoutKey]);
  }

  private async saveOrderToRedis(orderCode: number, orderKey: string, orderDto: CreateOrderDto) {
    await this.redisService.set(orderKey, orderDto);
    await this.redisService.createSet(String(orderCode), [orderKey]);;
  }

  private async addSessionIdToOrderSet(orderCode: number, sessionId: string) {
    await this.redisService.addToSet(String(orderCode), [sessionId]);
  }

  private async delSession(sessionId: string) {
    await this.redisService.del("sess:" + sessionId);
  }

  async getPaymentInfo(orderCode: number) {
    const paymentLink = await this.payOS.getPaymentLinkInformation(orderCode);
    return paymentLink;
  }

  async cancelPayment(orderCode: number) {
    const cancelledPaymentLink = await this.payOS.cancelPaymentLink(orderCode);
    const [orderKey, checkoutKey] = await this.redisService.getSetMembers(String(orderCode));
    await this.cleanOrderRedis(orderCode, orderKey, checkoutKey);
    return cancelledPaymentLink;
  }

  async cleanOrderRedis(orderCode: number, orderKey: string, checkoutKey: string) {
    await Promise.all([
      this.redisService.del(orderKey),
      this.redisService.del(checkoutKey),
      this.redisService.del(String(orderCode))
    ]);
  }

  async handlePaymentHook(req: Request, res: Response) {
    const paymentHookResponse: WebhookType = req.body;
    const isValidData = await this.payOS.verifyPaymentWebhookData(paymentHookResponse);

    if (!isValidData) {
      throw new InternalServerErrorException("Invalid data from PayOS");
    }
    
    const orderCode = paymentHookResponse.data.orderCode;
    const [orderKey, checkoutKey, sessionId] = await this.redisService.getSetMembers(String(orderCode));
    const orderData = await this.redisService.get(orderKey);
    await this.orderService.saveOrderDb(orderData);
    await this.cleanOrderRedis(orderCode, orderKey, checkoutKey);
    await this.delSession(sessionId);
    const paymentEntity = {
      ...paymentHookResponse.data,
      errorDescription: paymentHookResponse.data.desc
    };
    delete paymentEntity.desc;
    await this.paymentRepository.save(paymentEntity);

    return res.json();
  }

  private async getPaymentDtoFromOrderDto(orderDto: CreateOrderDto) {
    const paymentDto = new CreatePaymentDto(orderDto);
    const orderCode = await this.redisService.incr("order_code_seq");
    paymentDto.setOrderCode(orderCode);
    return paymentDto;
  }
  
  private createOrderKeyFromOrderDto(createOrderDto: CreateOrderDto) {
    const phone = createOrderDto.phone;
    const postfix = createOrderDto.order_items.reduce((acc, item) => {
      return acc + (item.id_pro * item.quantity * item.price);
    }, 0);
    return postfix + Number(phone.slice(-3));
  }
}



