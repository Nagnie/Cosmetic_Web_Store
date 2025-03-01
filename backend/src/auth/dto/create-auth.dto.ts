import { Transform } from "class-transformer";
import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";
import * as moment from 'moment';

export class CreateAuthDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        return moment(value, "DD/MM/YYYY").toDate()})
    dob: Date;

    @IsNotEmpty()
    cccd: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phone: string;
}
