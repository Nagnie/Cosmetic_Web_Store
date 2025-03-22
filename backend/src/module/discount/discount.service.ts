import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ResponseDto } from '@/helpers/utils';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const existingDiscount = this.discountRepository.findOne({
        where: {
          code: createDiscountDto.code
        }
      });

      if (!existingDiscount) {
        throw new InternalServerErrorException("Discount has existed");
      }

      const newDiscount = await this.discountRepository.save(createDiscountDto);

      return new ResponseDto(HttpStatus.CREATED, "Successfully", newDiscount);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(req: Request) {
    const {
      page = 1,
      limit = 5,
      sortBy = "id",
      orderBy = "ASC"
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const limitNumber = Math.max(1, parseInt(limit as string, 10));
    const order = (orderBy as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const [items, total] = await this.discountRepository.findAndCount({
      order: { [sortBy as string]: order },
      take: limitNumber,
      skip: (pageNumber - 1) * limitNumber,
    });
  
    return new ResponseDto(HttpStatus.OK, "Successfully", {
      total_pages: Math.ceil(total / (limit as number)),
      total_items: total,
      page,
      data: items
    })
  }

  async findOne(id: number, code: string) {
    const whereClause = id ? {id} : {code};

    const discount = await this.discountRepository.findOne({ 
      where: [
        whereClause
      ]
    });

    if (!discount) {
      throw new HttpException(`Discount not found for id: ${id}`, HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(HttpStatus.OK, "Successfully", discount);
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const existingDiscount = await this.discountRepository.findOne({
      where: {
        id
      }
    });

    if (!existingDiscount) {
      throw new HttpException("Discount has not existed", HttpStatus.BAD_REQUEST);
    }

    const newDiscount = await this.discountRepository.update(id, updateDiscountDto);

    return new ResponseDto(HttpStatus.OK, "Successfully", null);
  }

  async remove(id: number) {
    const existingDiscount = await this.discountRepository.findOne({
      where: {
        id
      }
    });

    if (!existingDiscount) {
      throw new HttpException("Discount has not existed", HttpStatus.BAD_REQUEST);
    }

    await this.discountRepository.delete(id);

    return new ResponseDto(HttpStatus.OK, "Successfully", null);
  }
}
