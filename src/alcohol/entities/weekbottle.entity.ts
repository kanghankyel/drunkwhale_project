import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Alcohol } from "./alcohol.entity";

@Entity('tb_weekbottle')
export class Weekbottle extends BaseEntity {

    // 주간보틀_고유번호
    @PrimaryGeneratedColumn()
    weekbottle_idx!: number;

    // 주류_고유번호(FK)
    @Column({nullable: true})
    alcohol_idx: number;

    // 주간보틀_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    weekbottle_createdate: string;

    // 주간보틀_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    weekbottle_updatedate: string;

    // 주간보틀_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    weekbottle_deletedate: string;

    // 주류 JOIN
    @ManyToOne(() => Alcohol)
    @JoinColumn({name: 'alcohol_idx', referencedColumnName: 'alcohol_idx'})
    alcohol: Alcohol;

}