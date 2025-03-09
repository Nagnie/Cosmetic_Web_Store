import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../order_status.enum";

@Entity({name: "orders"})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "customer"})
    customer: string;

    @Column({name: "phone"})
    phone: string;

    @Column({name: "addresss"})
    address: string;

    @Column({name: "status"})
    status: OrderStatus;
    
    @Column({name: "sum_price", default: 0})
    sumPrice: number;
    
    @Column({name: "note"})
    note: string;
}
