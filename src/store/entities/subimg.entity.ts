import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity('tb_subimg')
export class Subimg extends BaseEntity {

    // 스토어_서브이미지_고유번호
    @PrimaryGeneratedColumn('increment')
    subimg_idx!: number;

    // 스토어_서브이미지 (원본파일명)
    @Column({nullable: true})
    store_subimgname: string;

    // 스토어_서브이미지 (유니크명)
    @Column({nullable: true})
    store_subimgkey: string;

    // 스토어_서브이미지 (경로)
    @Column({nullable: true})
    store_subimgpath: string;

    // 스토어_고유번호 (FK)
    @Column({nullable: true})
    store_idx: number;

    // 스토어 JOIN
    @ManyToOne(() => Store)
    @JoinColumn({name: 'store_idx', referencedColumnName: 'store_idx'})
    store: Store;

}