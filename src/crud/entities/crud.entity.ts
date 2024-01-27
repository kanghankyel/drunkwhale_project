import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_crud')
export class Crud extends BaseEntity {

    @PrimaryGeneratedColumn()
    crud_idx: number;

    @Column()
    crud_name: string;

    @Column()
    crud_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    crud_createdate: string;

}
