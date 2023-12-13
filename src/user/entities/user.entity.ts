import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('tb_user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    user_idx!: number;

    @Column({nullable:true})
    user_id: string;

    @Column({nullable:true})
    user_pw: string;

    @Column({nullable:true})
    user_name: string;
    
    @Column({unique:true, nullable:true})
    user_phone: string;

    @Column({nullable:true})
    user_email: string;

    @Column({nullable:true})
    user_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    user_createdate!: string;

}