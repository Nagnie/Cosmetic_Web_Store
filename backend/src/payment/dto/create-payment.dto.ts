import { CreateOrderDto } from "@/module/order/dto/create-order.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @ApiProperty({
        description: "Id of order",
        example: 1,
        required: true
    })
    orderCode: number;

    @ApiProperty({
        description: "Items of order",
        required: true,
        type: () => [Item],
        example: [
            {
                name: "Item 1",
                price: 3000,
                quantity: 2
            },
            {
                name: "Item 2",
                price: 4000,
                quantity: 1
            }
        ]
    })
    @Type(() => Item)
    items: Item[];

    @ApiProperty({
        description: "Sum price of order",
        example: 10000,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    buyerName: string;

    buyerPhone: string;

    buyerAddress: string;

    expiredAt: number;

    checkoutType: string;

    constructor(createOrderDto: CreateOrderDto) {
        this.amount = createOrderDto.total_price;
        this.items = createOrderDto.order_items.map(item => ({
            name: item.pro_name,
            price: item.price,
            quantity: item.quantity
        }));
        this.orderCode = null;
        this.buyerName = createOrderDto.name;
        this.buyerPhone = createOrderDto.phone;
        this.buyerAddress = createOrderDto.address;
        this.expiredAt = Math.floor(Date.now() / 1000) + (60 * 18);
        this.checkoutType = createOrderDto.paid;
    }

    setOrderCode(code: number) {
        this.orderCode = code;
    }
}

class Item {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
    
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
