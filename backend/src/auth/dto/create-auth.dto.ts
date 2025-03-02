import { CreateUserDto } from "@/module/user/dto/create-user.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import * as moment from 'moment';

export class CreateAuthDto extends OmitType(PartialType(CreateUserDto), []) {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
