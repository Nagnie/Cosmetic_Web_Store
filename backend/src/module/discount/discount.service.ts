import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ILike, Like, Repository, DataSource } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ResponseDto } from '@/helpers/utils';
import { SortField } from './enum/sort_field.enum';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>
  ) { }

  async getDiscountInCart(@Req() req: Request & { session: any }){
    let total_prices = 0;
    if (req.session.total && req.session.total.total_prices !== undefined) {
      console.log("Total Prices:", req.session.total.total_prices);
      total_prices = req.session.total.total_prices;
    } else {
      console.log("Total Prices is not in session");
    }

    const today = new Date().toISOString().split('T')[0];
    const data = await this.dataSource.query(`
        SELECT * 
        FROM discount AS dis
        WHERE dis.is_available = $1
        AND dis.minimum_order_value <= $2
        AND $3 >= dis.start_at 
        AND $3 <= dis.end_at
      `, [true, total_prices, today]);

    return{
      data
    }
  }

  async applyDiscount(@Req() req: Request & { session: any }, applyDiscountDto: ApplyDiscountDto) {
    const { id } = applyDiscountDto;

    const data = await this.dataSource.query(`
        SELECT * 
        FROM discount AS dis
        WHERE dis.id = $1
      `, [id]);
    const voucher = data[0];

    console.log('VOUCHER: ', voucher);
    let total_prices = 0;
    if (req.session.total && req.session.total.total_prices !== undefined) {
      console.log("Total Prices:", req.session.total.total_prices);
      total_prices = req.session.total.total_prices;
    } else {
      console.log("Total Prices is not in session");
    }

    let discount = 0;
    // Block all conditions in get discount in cart/order --> So now we can you it freely
    console.log('VOUCHER UNIT: ', voucher.unit);
    if (voucher.unit === 'fixed') {
      discount = voucher.value;
    } else if (voucher.unit === 'percentage') {
      discount = voucher.value * total_prices / 100;
      if (discount > voucher.max_value) {
        discount = voucher.max_value;
      }
    }
    const new_total_prices = total_prices - discount;

    return {
      message: "Apply discount successfully",
      total_prices,
      discount,
      new_total_prices
    }
  }

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
    const whereClause = id ? { id } : { code };

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

  async searchAndFilter(req: Request) {
    const {
      code = "%",
      page = 1,
      limit = 5,
      sortBy = "value",
      orderBy = "ASC"
    } = req.query;

    const take =  isNaN(Number(limit)) ? 5 : Number(limit);
    const skip = (isNaN(Number(page)) || isNaN(Number(limit))) ? 0 : (Number(page) - 1) * Number(limit);
    const sortByValid = Object.values(SortField).filter((item) => item === (sortBy as string).toLowerCase());
    console.log(code, sortByValid);
    const [items, totalItems] = await this.discountRepository.findAndCount({
      where: {
        code: ILike(`%${code}%`)
      },
      order: { 
        [sortByValid[0]] : orderBy as string
      },
      take,
      skip,
    })

    return new ResponseDto(HttpStatus.OK, "Successfully", {
      total_pages: Math.ceil(totalItems / take),
      total_items: totalItems,
      page,
      limit,
      data: items
    })
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
