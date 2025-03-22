import { Injectable } from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ComboService {
  constructor(
    private readonly dataSource: DataSource
  ) { }
  create(createComboDto: CreateComboDto) {
    return 'This action adds a new combo';
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const data = await this.dataSource.query(
      `
        SELECT com.*, $3 AS type,
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

  findOne(id: number) {
    return `This action returns a #${id} combo`;
  }

  update(id: number, updateComboDto: UpdateComboDto) {
    return `This action updates a #${id} combo`;
  }

  remove(id: number) {
    return `This action removes a #${id} combo`;
  }
}
