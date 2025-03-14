import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MinioService } from '@/minio/minio.service';

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
  
  async create(creaetUserDto: CreateUserDto) {
    try {
      const {email, password}  = creaetUserDto;
      const user = this.usersRepository.create({
        email,
        password
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Internal server error");
    }
  }
}
