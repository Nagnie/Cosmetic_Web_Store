import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: `Product ID` })
    @IsNotEmpty({ message: `Product ID must not be empty` })
    @IsString({ message: `Product ID must be a number` })
    name: string;

    
}
