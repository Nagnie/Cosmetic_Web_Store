import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartDto {
    @ApiProperty({ example: 1, description: `Product ID` })
    @IsNotEmpty({ message: `Product ID must not be empty` })
    @IsNumber({}, { message: `Product ID must be a number` })
    id_pro: number;

    @ApiProperty({ example: 2, description: `Classification ID this product belongs to` })
    @IsNotEmpty({ message: `Classification ID must not be empty` })
    @IsNumber({}, { message: `Classification ID must be a number` })
    id_class: number;

    @ApiProperty({ example: 3, description: `Quantity of this product` })
    @IsNotEmpty({ message: `Quantity must not be empty` })
    @IsNumber({}, { message: `Quantity must be a number` })
    quantity: number;
}
