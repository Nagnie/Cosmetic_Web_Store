import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "brand"})
export class Brand {
    @PrimaryGeneratedColumn({name: "id_bra"})
    id: number;

    @Column({name: "name"})
    name: string;
}
