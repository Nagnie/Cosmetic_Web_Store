import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @ApiProperty({ example: 1, description: `Product or combo ID` })
    @IsNotEmpty({ message: `Product or combo ID must not be empty` })
    @IsNumber({}, { message: `Product or combo ID must be a number` })
    id_pro: number;

    @ApiProperty({ example: 3, description: `Old classification ID before user update` })
    @IsNotEmpty({ message: `Old classification ID must not be empty` })
    @IsNumber({}, { message: `Old classification ID must be a number` })
    old_id_class: number;

    @ApiProperty({ example: 2, description: `Classification ID this product belongs to` })
    @IsNotEmpty({ message: `Classification ID must not be empty` })
    @IsNumber({}, { message: `Classification ID must be a number` })
    id_class: number;

    @ApiProperty({ example: 3, description: `Quantity of this product` })
    @IsNotEmpty({ message: `Quantity must not be empty` })
    @IsNumber({}, { message: `Quantity must be a number` })
    quantity: number;

    @ApiProperty({ example: 'product', description: `Type of item` })
    @IsNotEmpty({ message: `Type must not be empty` })
    @IsString({ message: `Item's type must be string` })
    type: string;
}
