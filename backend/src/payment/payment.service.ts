import { HttpStatus, Injectable, InternalServerErrorException, Req } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ConfigService } from "@nestjs/config";
const PayOS = require("@payos/node");
import {
    CheckoutRequestType,
    CheckoutResponseDataType,
    WebhookDataType,
    WebhookType,
} from "@payos/node/lib/type";
import { Request, Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderService } from "@/module/order/order.service";
import { Payment } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { CreateOrderDto } from "@/module/order/dto/create-order.dto";
import { RedisService } from "@/redis/redis.service";
import { ResponseDto } from "@/helpers/utils";

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
        this.returnUrl = configService.get<string>("RETURN_URL");
        this.cancelUrl = configService.get<string>("CANCEL_URL");
        this.payOS = new PayOS(clientId, apiKey, checksumKey);
    }

    async checkout(@Req() req: Request & { session: any }, createOrderDto: CreateOrderDto) {
        //check redis
        const uniqueOrderKey = this.createOrderKeyFromOrderDto(createOrderDto);

        const checkoutKey = "CHECKOUT" + uniqueOrderKey;
        const existedCheckout = await this.redisService.get(checkoutKey);

        if (existedCheckout) {
            return new ResponseDto(
                HttpStatus.BAD_REQUEST,
                "Checkout has already existed",
                existedCheckout.checkoutUrl
            );
        }

        const paymentDto: CreatePaymentDto = await this.getPaymentDtoFromOrderDto(createOrderDto);
        const paymentRequest = this.createPaymentRequest(uniqueOrderKey, paymentDto);

        const orderKey = "ORDER" + uniqueOrderKey;
        await this.saveOrderToRedis(paymentRequest.orderCode, orderKey, createOrderDto);

        const checkoutInfo: CheckoutResponseDataType =
            await this.payOS.createPaymentLink(paymentRequest);
        console.log(checkoutInfo);
        this.savePaymentToRedis(paymentRequest.orderCode, checkoutKey, checkoutInfo);

        // const sessionId = req.session.id;
        // console.log(sessionId);
        // this.addSessionIdToOrderSet(paymentRequest.orderCode, sessionId);

        // Delete session
        req.session.destroy((err) => {
            if (err) {
                console.error("Lỗi khi xóa session:", err);
            }
        });

        //proxy to payos
        return new ResponseDto(200, "Successfully", checkoutInfo.checkoutUrl);

        //return res.redirect(checkoutInfo.checkoutUrl);
    }

    async checkExistedCheckout(createOrderDto: CreateOrderDto) {
        const uniqueOrderCode = this.createOrderKeyFromOrderDto(createOrderDto);
        const checkoutKey = "CHECKOUT" + uniqueOrderCode;
        const existedCheckout = await this.redisService.get(checkoutKey);

        if (existedCheckout) {
            return new ResponseDto(
                200,
                "Checkout has already existed",
                existedCheckout.checkoutUrl
            );
        } else {
            return new ResponseDto(400, "Checkout has not existed", null);
        }
    }

    private createPaymentRequest(
        uniqueOrderCode: string,
        paymentDto: CreatePaymentDto
    ): CheckoutRequestType {
        return {
            description:
                "THANH TOAN " +
                paymentDto.orderCode +
                String.fromCharCode(Math.floor(Math.random() * 26) + 65) +
                uniqueOrderCode,
            returnUrl: this.returnUrl,
            cancelUrl: this.cancelUrl,
            ...paymentDto,
        };
    }

    private async savePaymentToRedis(
        orderCode: number,
        checkoutKey: string,
        paymentInfo: CheckoutResponseDataType
    ) {
        await this.redisService.set(checkoutKey, paymentInfo);
        await this.redisService.addToSet(String(orderCode), [checkoutKey]);
    }

    private async saveOrderToRedis(orderCode: number, orderKey: string, orderDto: CreateOrderDto) {
        await this.redisService.set(orderKey, orderDto);
        await this.redisService.createSet(String(orderCode), [orderKey]);
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
            this.redisService.del(String(orderCode)),
        ]);
    }

    async handlePaymentHook(req: Request, res: Response) {
        const paymentHookResponse: WebhookType = req.body;
        const isValidData = await this.payOS.verifyPaymentWebhookData(paymentHookResponse);

        if (!isValidData) {
            throw new InternalServerErrorException("Invalid data from PayOS");
        }

        const orderCode = paymentHookResponse.data.orderCode;
        const [orderKey, checkoutKey] = await this.redisService.getSetMembers(String(orderCode));

        const orderData = await this.redisService.get(orderKey);
        await this.orderService.saveOrder(orderCode, orderData);

        const paymentEntity = {
            ...paymentHookResponse.data,
            errorDescription: paymentHookResponse.data.desc,
        };
        delete paymentEntity.desc;
        await this.paymentRepository.save(paymentEntity);

        await this.cleanOrderRedis(orderCode, orderKey, checkoutKey);

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
            return acc + item.id_pro * item.quantity * item.price;
        }, 0);
        return postfix + Number(phone.slice(-3)) + (createOrderDto.paid === "full" ? "F" : "H");
    }
}
