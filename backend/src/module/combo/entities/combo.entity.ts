import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ComboDetail } from "./combo_detail.entity";
import { ComboImage } from "./combo_image.entity";

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

    @Column({default: ""})
    description: string;

    @Column({default: "available"})
    status: string;

    @OneToMany(() => ComboDetail, (comboDetail) => comboDetail.combo)
    comboDetails: ComboDetail[];

    @OneToMany(() => ComboImage, (comboImage) => comboImage.combo)
    images: ComboImage[];
}
