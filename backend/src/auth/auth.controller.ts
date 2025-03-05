import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Req,
    Res,
    Query,
    Render,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { Public } from "@/helpers/decorator/public";
import { ResponseDto } from "@/helpers/utils";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("register")
    async register(@Body() createAuthDto: CreateAuthDto) {
        return await this.authService.register(createAuthDto);
    }

    @ApiOperation({summary: "Login"})
    @ApiBody({type: CreateAuthDto})
    @ApiResponse({type: ResponseDto})
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post("login")
    async login(@Request() req, @Res({ passthrough: true }) response: Response) {
        const token = await this.authService.login(req.user);

        response.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        return token;
    }

    @Get("renew_token/:refreshToken")
    @Public()
    async renewToken(@Param("refreshToken") refreshToken: string) {
        return await this.authService.refreshAccessToken(refreshToken);
    }
}
