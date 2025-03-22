import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/module/user/user.service';
import { comparePassword, hashPassword, ResponseDto } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    let isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const { password, ...res } = user;
    return res;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.username };
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
    return new ResponseDto(HttpStatus.OK, "Login successful", token);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const payload = { email: decoded.email, sub: decoded.sub };
      const newAccessToken = this.jwtService.sign(payload);

      return { access_token: newAccessToken };
    } catch (error) {
      // throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.usersService.findByEmail(createAuthDto.email);
      if (existingUser) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await hashPassword(createAuthDto.password);
      const newUser = await this.usersService.create({
        email: createAuthDto.email,
        password: hashedPassword,
      });

      return new ResponseDto(HttpStatus.CREATED, "User created successfully", newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Internal server error");
    }
  }

  async resetPassword(resetPassDto: ResetpassAuthDto) {
    const user = await this.usersService.findByEmail(resetPassDto.email);
    
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
    }

    user.password = await hashPassword(resetPassDto.newPassword);

    const res = await this.usersService.updateUser(user);
    
    return new ResponseDto(HttpStatus.OK, "Successfully", null);
  }
}
