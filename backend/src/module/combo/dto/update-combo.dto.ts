import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateComboDto } from './create-combo.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ComboStatus } from '../enum/combo_status.enum';

export class UpdateComboDto extends PartialType(CreateComboDto) {
    @ApiProperty({
        required: false,
        name: "name",
        description: "Name of combo",
        example: "Combo 1"
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
        name: "price",
        description: "Price of combo",
        example: 980000
    })
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty({
        required: false,
        name: "origin_price",
        description: "Origin price, equal sum of all product",
        example: 1000000
    })
    @IsOptional()
    @IsNumber()
    origin_price: number;

    @ApiProperty({
        required: false,
        name: "description",
        description: "Description of combo",
        example: "Combo contains 3 products"
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        required: false,
        name: "status",
        description: "Status of combo",
        enum: ComboStatus,
        example: "available"
    })
    @IsOptional()
    @IsEnum(["available", "order"])
    status: string;

    @ApiProperty({
        required: false,
        name: "productIds",
        description: "List product id",
        example: [1, 2, 3]
    })
    @IsOptional()
    @IsArray()
    @Type(() => Array<number>)
    productIds: number[];

    @ApiProperty({
        required: false,
        name: "imageLinks",
        description: "List images combo",
        example: ["link1", "link2", "link3"]
    })
    @IsOptional()
    @IsArray()
    @Type(() => Array<string>)
    imageLinks: string[];
}
