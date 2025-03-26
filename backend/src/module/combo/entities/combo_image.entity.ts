import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Combo } from "./combo.entity";

@Entity({name: "combo_image"})
export class ComboImage {
    @PrimaryGeneratedColumn({name: "id_img"})
    id: number;

    @ManyToOne(() => Combo, (combo) => combo.images)
    @JoinColumn({name: "id_combo"})
    combo: Combo;

    @Column()
    link: string;
}