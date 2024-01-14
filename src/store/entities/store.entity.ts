import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_store')
export class Store extends BaseEntity {

    @PrimaryGeneratedColumn()
    store_idx!: number;

    @Column()
    store_name: string;

    @Column()
    store_type: string;

    @Column()
    store_phone: string;

    @Column()
    store_regist: string;

    @Column()
    store_postcode: string;

    @Column()
    store_add: string;

    @Column()
    store_adddetail: string;

    @Column()
    store_opentime: string;

    @Column()
    store_closetime: string;

    @Column()
    store_info: string;

    @Column({default: 1000})
    store_score: number;

    @Column({default: 'A'})
    store_status: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    store_createdate!: string;

    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    store_updatedate: string;

    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    store_deletedate: string;

    @Column()
    user_idx: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_idx'})
    user: User;

}
