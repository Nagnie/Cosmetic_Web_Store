import { CreateUserDto } from "@/module/user/dto/create-user.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import * as moment from 'moment';

export class CreateAuthDto extends OmitType(PartialType(CreateUserDto), []) {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
