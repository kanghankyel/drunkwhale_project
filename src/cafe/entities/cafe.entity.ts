import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_cafe')
export class Cafe extends BaseEntity {

    @PrimaryGeneratedColumn()
    cafe_idx: number;

    @Column()
    cafe_name: string;

    @Column()
    cafe_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    cafe_createdate: string;

}
