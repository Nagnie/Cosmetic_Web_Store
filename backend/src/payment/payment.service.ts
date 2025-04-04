import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
const PayOS = require("@payos/node");
import { CheckoutRequestType, CheckoutResponseDataType } from '@payos/node/lib/type';

@Injectable()
export class PaymentService {
  private payOS: any;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const clientId = configService.get<string>("PAYOS_CLIENT_ID");
    const apiKey = configService.get<string>("PAYOS_API_KEY");
    const checksumKey = configService.get<string>("PAYOS_CHECKSUM_KEY");
    this.payOS = new PayOS(
      clientId,
      apiKey,
      checksumKey
    );
  }

  async getCheckoutUrl() {
    const checkoutRequest : CheckoutRequestType = {
      orderCode: 4,
      amount: 25000,
      description: "CK TEST ITEMS 2",
      items: [
        {
          name: "SP 1",
          price: 5000,
          quantity: 2,
        },
        {
          name: "SP 2",
          price: 3000,
          quantity: 5
        }
      ],
      returnUrl: "https://naucosmetic.com/payment-confirmation",
      cancelUrl: "https://naucosmetic.com/checkout/payment-methods"
    };
    const checkoutUrl: CheckoutResponseDataType = await this.payOS.createPaymentLink(checkoutRequest);

    return checkoutUrl;
  }

  async getPaymentInfo(orderCode: number) {
    const paymentLink = await this.payOS.getPaymentLinkInformation(orderCode);
    return paymentLink;
  }

  async cancelPayment(orderCode: number) {
    const cancelledPaymentLink = await this.payOS.cancelPaymentLink(orderCode);
    return cancelledPaymentLink
  }
}
