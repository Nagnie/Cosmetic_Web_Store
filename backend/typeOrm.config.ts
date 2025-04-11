import { Brand } from "@/module/brand/entities/brand.entity";
import { Category } from "@/module/category/entities/category.entity";
import { Combo } from "@/module/combo/entities/combo.entity";
import { ComboDetail } from "@/module/combo/entities/combo_detail.entity";
import { ComboImage } from "@/module/combo/entities/combo_image.entity";
import { Discount } from "@/module/discount/entities/discount.entity";
import { Order } from "@/module/order/entities/order.entity";
import { OrderDetail } from "@/module/order/entities/order_detail.entity";
import { Product } from "@/module/product/entities/product.entity";
import { Subcategory } from "@/module/subcategory/entities/subcategory.entity";
import { User } from "@/module/user/entities/user.entity";
import { Payment } from "@/payment/entities/payment.entity";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
// const configService = new ConfigService();
export default new DataSource({
  type: "postgres",
  host: "88.222.212.40",
  port: 5432,
  username: "bookastaydata",
  password: "bookastaydata",
  database: "cosmeticstrore",
  migrations: ["./migrations/**"],
  entities: [
    User,
    Image,
    Brand,
    Product,
    Category,
    Subcategory,
    Order,
    OrderDetail,
    Discount,
    Combo,
    ComboDetail,
    ComboImage,
    Payment
  ],
});
