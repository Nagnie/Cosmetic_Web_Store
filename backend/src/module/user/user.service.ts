import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hashPassword } from '@/helpers/utils';
import { query, Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { MinioService } from '@/minio/minio.service';
import { ResetpassAuthDto } from '@/auth/dto/resetpassword-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly minioService: MinioService,
  ) {}

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email
        }
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
