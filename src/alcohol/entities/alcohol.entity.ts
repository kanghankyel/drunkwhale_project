import { Cabinet } from "src/cabinet/entities/cabinet.entity";
import { Subscribe } from "src/subscribe/entities/subscribe.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_alcohol')
export class Alcohol extends BaseEntity {

    // 주류_고유번호
    @PrimaryGeneratedColumn()
    alcohol_idx!: number;

    // 주류_이미지 (원본파일명)
    @Column({nullable: true})
    alcohol_imgname: string;

    // 주류_이미지 (유니크명)
    @Column({nullable: true})
    alcohol_imgkey: string;

    // 주류_이미지 (경로)
    @Column({nullable: true})
    alcohol_imgpath: string;

    // 주류_이름
    @Column({nullable: true, unique: true})
    alcohol_name: string;

    // 주류_타입
    @Column({nullable: true})
    alcohol_type: string;

    // 주류_분류
    @Column({nullable: true})
    alcohol_class: string;

    // 주류_국적
    @Column({nullable: true})
    alcohol_from: string;

    // 주류_도수
    @Column({nullable: true})
    alcohol_percent: string;

    // 주류_색상
    @Column({nullable: true})
    alcohol_color: string;

    // 주류_향
    @Column({nullable: true})
    alcohol_aroma: string;

    // 주류_맛
    @Column({nullable: true})
    alcohol_flavor: string;

    // 주류_설명
    @Column({type: 'text', nullable: true})
    alcohol_info: string;

    // 주류_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    alcohol_createdate: string;

    // 주류_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    alcohol_updatedate: string;

    // 주류_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    alcohol_deletedate: string;

    // 회원_이메일(FK)
    @Column()
    user_email: string;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    user: User;

    // 술장고 JOIN
    @OneToMany(() => Cabinet, cabinet => cabinet.alcohol)
    cabinets: Cabinet[];

    // 찜 JOIN
    @OneToMany(() => Subscribe, subscribe => subscribe.alcohol)
    subscribes: Subscribe[];

    // 이 방식은 회원의 모든 정보까지 다 받아와서 게시하기 때문에 일단은 55줄~62줄로 대체
    // @ManyToOne(() => User, (user) => user.alcohols)
    // @JoinColumn({name: 'user_idx', referencedColumnName: 'user_idx'})
    // user: User;

}
