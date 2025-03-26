import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePosterDto {
    @ApiProperty({ example: '/link_poster', description: `Poster image's link` })
    @IsNotEmpty({ message: `Poster image's link` })
    @IsString({ message: `Poster image's link must be a string` })
    link: string;
}
