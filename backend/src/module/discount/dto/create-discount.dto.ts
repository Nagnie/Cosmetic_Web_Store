import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Discount } from "../entities/discount.entity";
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUppercase } from "class-validator";
import { Transform } from "class-transformer";
import * as moment from "moment";

export class CreateDiscountDto extends OmitType(PartialType(Discount), ["id"]){
    @IsString()
    @IsUppercase()
    @IsOptional()
    code?: string;

    @IsNotEmpty()
    @IsNumber()
    value?: number;

    @IsNotEmpty()
    @IsBoolean()
    isAvailable?: boolean;

    @IsNotEmpty()
    @IsEnum(["percentage", "fixed"])
    unit?: string;

    @IsNotEmpty()
    @IsDateString()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    start_at?: Date;

    @IsNotEmpty()
    @IsDateString()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    end_at?: Date;

    @IsOptional()
    @IsNumber()
    max_value?: number;

    @IsNotEmpty()
    @IsNumber()
    minimum_order_value?: number;
}
