import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ComboDetail } from "./combo_detail.entity";

@Entity({name: "combo"})
export class Combo {
    @PrimaryGeneratedColumn({name: "id_combo"})
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({name: "origin_price"})
    origin_price: number;

    @Column()
    description: string;

    @Column({default: "available"})
    status: string;

    @OneToMany(() => ComboDetail, (comboDetail) => comboDetail.combo)
    comboDetails: ComboDetail[];


}
