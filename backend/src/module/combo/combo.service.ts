import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { ComboDetail } from './entities/combo_detail.entity';
import { ComboImage } from './entities/combo_image.entity';
import { ResponseDto } from '@/helpers/utils';
import { Request } from 'express';
import { SortField } from './enum/sort_field.enum';
import { ComboStatus } from './enum/combo_status.enum';

@Injectable()
export class ComboService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
    @InjectRepository(ComboDetail)
    private readonly comboDetailRepository: Repository<ComboDetail>,
    @InjectRepository(ComboImage)
    private readonly comboImageRepository: Repository<ComboImage>
  ) { }

  async create(createComboDto: CreateComboDto) {
    const existingCombo = await this.comboRepository.findOne({
      where: {
        name: createComboDto.name
      }
    });

    if (existingCombo) {
      throw new HttpException("Combo (name) has existed", HttpStatus.BAD_REQUEST);
    }

    const {productIds, imageLinks, ...comboBasicInfo} = createComboDto;
    const combo = await this.comboRepository.save(comboBasicInfo);

    const products = productIds.map((productId) => ({
      combo,
      product: {id_pro: productId}
    }));

    const images = imageLinks.map((item) => ({
      combo,
      link: item
    }));
    await Promise.all([
      this.comboDetailRepository.save(products),
      this.comboImageRepository.save(images)
    ]);

    return new ResponseDto(HttpStatus.OK, "Successfully", combo);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const data = await this.dataSource.query(
      `
        SELECT com.id_combo AS id_combo, com.name AS name, (com.price::NUMERIC)::FLOAT AS price, (com.origin_price::NUMERIC)::FLOAT AS origin_price, com.description AS description, com.status AS status, $3 AS type,
        COALESCE((
          SELECT json_agg(img.link)
          FROM combo_image AS img
          WHERE img.id_combo = com.id_combo), '[]'::json
        ) AS images,
        COALESCE((
          SELECT json_agg(DISTINCT jsonb_build_object(
            'id_comde', comde.id_comde,
            'id_pro', comde.id_pro,
            'pro_name', pro.name,
            'pro_origin_price', pro.origin_price,
            'pro_price', pro.price,
            'pro_images', (
              SELECT json_agg(pimg.link)
              FROM product_image AS pimg
              WHERE pimg.id_pro = pro.id_pro
            ),
            'pro_classification', (
              SELECT json_agg(jsonb_build_object(
                'id_class', class.id_class,
                'class_name', class.name
              ))
              FROM classification AS class
              WHERE class.id_pro = pro.id_pro
            )
          ))
          FROM combo_detail AS comde
          LEFT JOIN product AS pro ON comde.id_pro = pro.id_pro
          WHERE comde.id_combo = com.id_combo
        ), '[]'::json) AS products
        FROM combo AS com
        ORDER BY com.id_combo ASC
        LIMIT $1 OFFSET $2
        `,
      [limit, offset, "combo"]
    );

    const totalQuery = await this.dataSource.query(`
      SELECT COUNT(com.id_combo) AS total_items
      FROM combo AS com
    `);

    const total_items = Number(totalQuery[0]?.total_items || 0);
    // console.log('TOTAL ITEMS: ', total_items);

    const total_pages = Math.ceil(total_items / limit);

    return {
      message: "All combos",
      page: page,
      limit: limit,
      total_pages: total_pages,
      total_items: total_items,
      data: data,
    };
  }

  async findOne(id_combo: number) {
    const data = await this.dataSource.query(
      `
      SELECT com.id_combo AS id_combo, com.name AS name, (com.price::NUMERIC)::FLOAT AS price, (com.origin_price::NUMERIC)::FLOAT AS origin_price, com.description AS description, com.status AS status, $2 AS type,
      COALESCE((
        SELECT json_agg(img.link)
        FROM combo_image AS img
        WHERE img.id_combo = com.id_combo), '[]'::json
      ) AS images,
      COALESCE((
        SELECT json_agg(DISTINCT jsonb_build_object(
          'id_comde', comde.id_comde,
          'id_pro', comde.id_pro,
          'pro_name', pro.name,
          'pro_origin_price', pro.origin_price,
          'pro_price', pro.price,
          'pro_images', (
            SELECT json_agg(pimg.link)
            FROM product_image AS pimg
            WHERE pimg.id_pro = pro.id_pro
          ),
          'pro_classification', (
            SELECT json_agg(jsonb_build_object(
              'id_class', class.id_class,
              'class_name', class.name
            ))
            FROM classification AS class
            WHERE class.id_pro = pro.id_pro
          )
        ))
        FROM combo_detail AS comde
        LEFT JOIN product AS pro ON comde.id_pro = pro.id_pro
        WHERE comde.id_combo = com.id_combo
      ), '[]'::json) AS products
      FROM combo AS com
      WHERE com.id_combo = $1
    `,
      [id_combo, "combo"]
    );

    return {
      data: data
    };
  }

  async update(id: number, updateComboDto: UpdateComboDto) {
    const existingCombo = await this.comboRepository.findOneOrFail({
      where: {
        id
      }
    });

    if (!existingCombo) {
      throw new HttpException("Combo has not existed", HttpStatus.BAD_REQUEST);
    }

    if (!updateComboDto) {
      return new HttpException("Failed to update because body has not defined", HttpStatus.BAD_REQUEST);
    }

    const { productIds, imageLinks, ...comboInfo } = updateComboDto;

    if (productIds) {
      this.updateComboItems(this.comboDetailRepository, existingCombo, productIds, "product");
    }

    if (imageLinks) {
      this.updateComboItems(this.comboImageRepository, existingCombo, imageLinks, "image");
    }
    
    if (Object.keys(comboInfo).length === 0) {
      return new ResponseDto(HttpStatus.OK, "Successfully", null);
    }

    await this.comboRepository.update(id, comboInfo);

    return new ResponseDto(HttpStatus.OK, "Successfully", null);
  }

  async searchAndFilter(req: Request) {
    const {
      name = "",
      status = "available",
      page = 1,
      limit = 5,
      sortBy = "price",
      orderBy = "ASC"
    } = req.query;

    const take =  isNaN(Number(limit)) ? 5 : Number(limit);
    const skip = (isNaN(Number(page)) || isNaN(Number(limit))) ? 0 : (Number(page) - 1) * Number(limit);
    const statusValid = Object.values(ComboStatus).filter((item) => item === (status as string).toLowerCase());
    const sortByValid = Object.values(SortField).filter((item) => item === (sortBy as string).toLowerCase());

    const [items, totalItems] = await this.comboRepository.findAndCount({
      where: {
        name: ILike(`%${name}%`),
        status: ILike(`%${statusValid[0] ? statusValid : ""}%`)
      },
      relations: ["comboDetails", "comboDetails.product", "images"],
      order: {
        [sortByValid[0]]: orderBy as string
      },
      take,
      skip
    });

    return new ResponseDto(HttpStatus.OK, "Successfully", {
      total_pages: Math.ceil(totalItems / take),
      total_items: totalItems,
      page,
      limit,
      data: items
    });
  }

  async  updateComboItems(
    entityRepository: any,
    combo: Combo,
    items: any[],
    itemType: 'product' | 'image',
  ): Promise<void> {
    if (items) {
      const entities = items.map((item) => {
        if (itemType === 'product') {
          return {
            combo,
            product: { id_pro: item }, 
          };
        } else if (itemType === 'image') {
          return {
            combo,
            link: item, 
          };
        }
      });
  
      await Promise.all([
        entityRepository.delete({combo}), 
        entityRepository.save(entities),
      ]);
    }
  }

  async remove(id: number) {
    try {
      const combo = await this.comboRepository.findOneByOrFail({});

      await this.comboRepository.delete(id);

      return new ResponseDto(HttpStatus.OK, "Successfully", null);
    } catch (error) {
      throw new HttpException("Combo has not exited", HttpStatus.BAD_REQUEST);
    }
  }
}
