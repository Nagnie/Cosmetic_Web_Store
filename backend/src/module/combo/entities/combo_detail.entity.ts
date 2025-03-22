import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Combo } from "./combo.entity";
import { Product } from "@/module/product/entities/product.entity";

@Entity({name: "combo_detail"})
export class ComboDetail {
    @PrimaryGeneratedColumn({name: "id_comde"})
    id: number;

    @ManyToOne(() => Combo, (combo) => combo.comboDetails)
    @JoinColumn({name: "id_combo"})
    combo: Combo;

    @ManyToOne(() => Product, (product) => product.comboDetails)
    @JoinColumn({name: "id_pro"})
    product: Product;
}