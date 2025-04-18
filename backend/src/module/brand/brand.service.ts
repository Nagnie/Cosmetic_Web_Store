import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandRepository.create({
        ...createBrandDto
      });

      await this.brandRepository.save(brand);
      return new ResponseDto(HttpStatus.CREATED, "Successfully", brand);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(req: Request) {
    try {
      const {
        page = 1,
        limit = 5,
        sortBy = 'id',
        order = 'ASC',
      } = req.query;

      const take = limit as number;
      const skip = ((page as number) - 1) * (limit as number);

      // const data = await this.brandRepository.find({
      //   order: {[(sortBy as string).toLowerCase()]: order},
      //   skip,
      //   take
      // });
      const [items, total] = await this.brandRepository.findAndCount({
        order: {[(sortBy as string).toLowerCase()]: order},
        skip,
        take
      });

      return new ResponseDto(HttpStatus.OK, "Successfully", {
        total_pages: Math.ceil(total / take),
        total_items: total,
        page,
        limit,
        data: items
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.brandRepository.findOne({
        where: {id}
      });

      if (data) {
        return new ResponseDto(HttpStatus.OK, "Successfully", data);
      }

      throw new HttpException("Brand not found with id: " + id, HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.brandRepository.findOne({
        where: {id}
      });

      if (!brand) {
        throw new HttpException("Brand not found with id: " + id, HttpStatus.NOT_FOUND);
      }
      await this.brandRepository.update(id, updateBrandDto);

      return new ResponseDto(HttpStatus.OK, "Successfully", updateBrandDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async remove(id: number) {
    try {
      const brand = await this.brandRepository.findOne({
        where: {id}
      });

      if (!brand) {
        throw new HttpException("Brand not found with id: " + id, HttpStatus.NOT_FOUND);
      }

      await this.brandRepository.delete(id);
      return new ResponseDto(HttpStatus.OK, "Successfully", null);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
