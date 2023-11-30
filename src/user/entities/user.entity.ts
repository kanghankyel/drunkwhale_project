import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('tb_user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    user_idx!: number;

    @Column()
    user_id: string;

    @Column()
    user_pw: string;
    
    @Column({unique:true})
    user_phone: string;

    @Column()
    user_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    user_createdate!: string;

}