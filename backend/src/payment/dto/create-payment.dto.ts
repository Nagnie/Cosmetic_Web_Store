import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @ApiProperty({
        description: "Id of order",
        example: 1,
        required: true
    })
    orderCode: number;
}
