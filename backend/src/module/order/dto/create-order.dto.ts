import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class OrderItemDto {
    @ApiProperty({ example: 1, description: "Product ID" })
    @IsNumber({}, { message: "Product ID must be a number" })
    @IsNotEmpty({ message: "Product ID must not be empty" })
    id_pro: number;

    @ApiProperty({ example: `/localhost`, description: `Product's image link` })
    @IsOptional()
    @IsString({ message: `Product's image link must be a string` })
    pro_image: string;

    @ApiProperty({ example: ``, description: `Product's name` })
    @IsOptional()
    @IsString({ message: `Product's name must be a string` })
    pro_name: string;

    @ApiProperty({ example: 5, description: "Classification ID" })
    @IsNumber({}, { message: "Classification ID must be an number" })
    @IsNotEmpty({ message: "Classification ID must not be empty" })
    id_class: number;

    @ApiProperty({ example: ``, description: `Classification's name` })
    @IsOptional()
    @IsString({ message: `Classification's name must be a string` })
    class_name: string;

    @ApiProperty({ example: 2, description: "Quantity" })
    @IsNumber({}, { message: "Quantity must be an integer" })
    @IsNotEmpty({ message: "Quantity must not be empty" })
    quantity: number;

    @ApiProperty({ example: 5, description: "Price per unit * quantity" })
    @IsNumber({}, { message: "Price must be a number" })
    @IsNotEmpty({ message: "Price must not be empty" })
    price: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: `Nguyen Van A`, description: `Customer's name` })
    @IsNotEmpty({ message: `Customer's name must not be empty` })
    @IsString({ message: `Customer's name must be a string` })
    name: string;

    @ApiProperty({ example: `nguyenvana@gmail.com`, description: `Customer's email` })
    @IsOptional()
    @IsString({ message: `Customer's email must be a string` })
    email: string;

    @ApiProperty({ example: `0123456789`, description: `Customer's phone number` })
    @IsNotEmpty({ message: `Customer's phone number must not be empty` })
    @IsString({ message: `Customer's phone number must be a string` })
    phone: string;

    @ApiProperty({ example: `Somewhere`, description: `Customer's address` })
    @IsNotEmpty({ message: `Customer's address must not be empty` })
    @IsString({ message: `Customer's address must be a string` })
    address: string;

    @ApiProperty({ example: `Quickly`, description: `Customer's note` })
    @IsOptional()
    @IsString({ message: `Customer's note must be a string` })
    note: string;

    @ApiProperty({
        example: [
            { 
                "id_pro": 1, "pro_image": "product01", "pro_name": "Toner TheOrdinary Glycolic Acid 7%Toning Solution", "id_class": 1, "class_name": "20ml", "quantity": 3, "price": 400.00
            },
            { 
                "id_pro": 2, "pro_image": "product02", "pro_name": "Toner TheOrdinary Glycolic Acid 7%Toning Solution", "id_class": 1, "class_name": "20ml", "quantity": 3, "price": 400.00 
            }
        ],
        description: "List of order items"
    })
    @IsArray({ message: "Order items must be an array" })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    order_items: OrderItemDto[];

    @ApiProperty({ example: 5, description: "Total price" })
    @IsNumber({}, { message: "Total price must be a number" })
    @IsNotEmpty({ message: "Total price must not be empty" })
    total_price: number;
}
