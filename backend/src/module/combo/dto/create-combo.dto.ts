import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ComboStatus } from "../enum/combo_status.enum";
import { Type } from "class-transformer";

export class CreateComboDto {
    @ApiProperty({
        name: "name",
        description: "Name of combo",
        example: "Combo 1"
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        name: "price",
        description: "Price of combo",
        example: 980000
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        name: "origin_price",
        description: "Origin price, equal sum of all product",
        example: 1000000
    })
    @IsNotEmpty()
    @IsNumber()
    origin_price: number;

    @ApiProperty({
        name: "description",
        description: "Description of combo",
        example: "Combo contains 3 products"
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        name: "status",
        description: "Status of combo",
        enum: ComboStatus,
        example: "available"
    })
    @IsNotEmpty()
    @IsEnum(["available", "order"])
    status: string;

    @ApiProperty({
        name: "productIds",
        description: "List product id",
        example: [1, 2, 3]
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array<number>)
    productIds: number[];

    @ApiProperty({
        name: "imageLinks",
        description: "List images combo",
        example: ["link1", "link2", "link3"]
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array<string>)
    imageLinks: string[];
}
