import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../order_status.enum";
import { OrderDetail } from "./order_detail.entity";

@Entity({name: "orders"})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "email"})
    email: string;

    @Column({name: "customer"})
    customer: string;

    @Column({name: "email"})
    email: string;

    @Column({name: "phone"})
    phone: string;

    @Column({name: "address"})
    address: string;

    @Column({name: "status"})
    status: OrderStatus;
    
    @Column({name: "sum_price", default: 0})
    sumPrice: number;
    
    @Column({name: "note"})
    note: string;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[];
}
