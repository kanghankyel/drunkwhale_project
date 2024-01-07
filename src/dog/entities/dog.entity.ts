import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_dog')
export class Dog extends BaseEntity {

    @PrimaryGeneratedColumn()
    dog_idx!: number;

    @Column({nullable: true})
    dog_name: string;

    @Column({nullable: true})
    dog_gender: string;

    @Column({nullable: true})
    dog_species: string;

    @Column({nullable: true})
    dog_size: string;

    @Column({nullable: true})
    dog_age: string;

    @Column({nullable: true})
    dog_personality: string;

    @Column({nullable: true})
    dog_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    dog_createdate: string;

    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    dog_updatedate: string;

    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    dog_deletedate: string;

    @Column()
    user_idx: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_idx'})
    user: User;

    // @ManyToOne(() => User, (user) => user.dogs)
    // @JoinColumn({name: 'user_idx', referencedColumnName: 'user_idx'})
    // user: User;

}
