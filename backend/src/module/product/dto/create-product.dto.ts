import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Liquid Foundation', description: `Product's name` })
    @IsNotEmpty({ message: `Product's name must not be empty` })
    @IsString({ message: `Product's name must be string` })
    pro_name: string

    @ApiProperty({ example: '20000', description: `Product's price` })
    @IsNotEmpty({ message: `Product's price must not be empty` })
    @IsNumber({}, { message: `Products's price must be number` })
    price: number

    @ApiProperty({ example: 1, description: `Subcategory ID this product belongs to` })
    @IsNotEmpty({ message: `Subcategory ID must not be empty` })
    @IsNumber({}, { message: `Subcategory ID must be a number` })
    id_subcat: number;

    @ApiProperty({ example: 1, description: `Brand ID this product belongs to` })
    @IsNotEmpty({ message: `Brand ID must not be empty` })
    @IsNumber({}, { message: `Brand ID must be a number` })
    id_bra: number;

    @ApiProperty({ example: 20, description: `Product's stock` })
    @IsNumber({}, { message: `Stock must be a number` })
    @IsOptional()
    stock: number;

    @ApiProperty({ example: 'Available', description: `Product's status` })
    @IsNotEmpty({ message: `Product's status must not be empty` })
    @IsString({ message: `Product's status must be string` })
    status: string

    @ApiProperty({
        example: ['/link1', '/link2', '/link3'],
        description: `List of images'url`,
        isArray: true
    })
    @IsArray({ message: `Link must be an array` })
    @IsString({ each: true, message: `Each link must be a string` })
    @IsOptional()
    img_url?: string[];

    @ApiProperty({
        example: 'This foundation provides full coverage with a natural matte finish.',
        description: `Product's description`,
        type: 'string'
    })
    @IsString({ message: `Product's description must be a string` })
    @IsOptional()
    desc?: string;
}
