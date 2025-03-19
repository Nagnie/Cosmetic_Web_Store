import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as moment from 'moment';

@Entity({name: "discount"})
export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "NOCODE"})
    code: string;

    @Column()
    value: number;

    @Column({name: "is_available", default: true})
    isAvailable: boolean;

    @Column({default: "percentage"})
    unit: string;

    @Column({default: moment().toDate()})
    start_at: Date;

    @Column({default: moment().add(1, "months").toDate()})
    end_at: Date;

    @Column({default: 0})
    max_value: number;

    @Column({default: 0})
    minimum_order_value: number;
}
