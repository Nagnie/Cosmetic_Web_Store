import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "brand"})
export class Brand {
    @PrimaryGeneratedColumn({name: "id_bra"})
    id: number;

    @Column({name: "name"})
    name: string;

    @Column({name: "num_pro", default: 0})
    numProducts: number;

    @Column({name: "image"})
    image: string;
}
