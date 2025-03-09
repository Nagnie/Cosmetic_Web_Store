import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity({name: "order_detail"})
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "order_id"})
    orderId: number;

    @Column({name: "product_id"})
    productId: number;

    @Column({name: "quantity"})
    quantity: number;

    @Column({name: "price"})
    price: number;
}