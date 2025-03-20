import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Discount } from "../entities/discount.entity";
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUppercase } from "class-validator";
import { Transform } from "class-transformer";
import * as moment from "moment";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDiscountDto extends OmitType(PartialType(Discount), ["id"]){
    @ApiProperty({
        description: "Discount code",
        example: "FREESHIP",
        required: false,
        default: ""
    })
    @IsString()
    @IsUppercase()
    @IsOptional()
    code?: string;

    @ApiProperty({
        description: "Discount value (percentage: 0 < x < 100 or fixed)",
        example: 10,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    value?: number;

    @ApiProperty({
        description: "Status: is available or not",
        example: true,
        enum: [true, false]
    })
    @IsNotEmpty()
    @IsBoolean()
    isAvailable?: boolean;

    @ApiProperty({
        description: "Discount unit",
        example: "percentage",
        enum: ["percentage", "fixed"],
        required: true
    })
    @IsNotEmpty()
    @IsEnum(["percentage", "fixed"])
    unit?: string;

    @ApiProperty({
        description: "Start date to apply discount",
        example: "2025-03-19",
        required: true,
        default: moment().toDate()
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    start_at?: Date;

    @ApiProperty({
        description: "End date can apply discount",
        example: "2025-04-19",
        required: true,
        default: moment().add(1, "months").toDate()
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    end_at?: Date;

    @ApiProperty({
        description: "Maximum value can be reduced",
        example: 100000,
        required: true
    })
    @IsOptional()
    @IsNumber()
    max_value?: number;

    @ApiProperty({
        description: "Minimum order value to apply discount",
        example: 100000,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    minimum_order_value?: number;
}
