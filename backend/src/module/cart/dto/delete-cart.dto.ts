import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteCartDto {
    @ApiProperty({ example: 1, description: `Product ID` })
    @IsNotEmpty({ message: `Product ID must not be empty` })
    @IsNumber({}, { message: `Product ID must be a number` })
    id_pro: number;

    @ApiProperty({ example: 2, description: `Classification ID this product belongs to` })
    @IsNotEmpty({ message: `Classification ID must not be empty` })
    @IsNumber({}, { message: `Classification ID must be a number` })
    id_class: number;

    @ApiProperty({ example: 'product', description: `Type of item` })
    @IsNotEmpty({ message: `Type must not be empty` })
    @IsString({ message: `Item's type must be string` })
    type: string;
}