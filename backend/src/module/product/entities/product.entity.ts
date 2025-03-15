import { Image } from "@/module/image/entities/image.entity";
import { OrderDetail } from "@/module/order/entities/order_detail.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn({name: "id_pro"})
    id_pro: number;

    @Column({name: "name"})
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    id_subcat: number;

    @Column({name: "id_bra"})
    id_bra: number;

    // @Column()
    // stock: number;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
    order_details: OrderDetail;

    @OneToMany(() => Image, image => image.product)
    images: Image[];
}
