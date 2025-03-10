import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../order_status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiProperty({description: "Read or not read status", required: false})
    @IsOptional()
    checked: boolean;

    @ApiProperty(
        {
            description: "Status of order", 
            required: false,
            enum: OrderStatus
        })
    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
