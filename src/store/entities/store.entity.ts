import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subimg } from "./subimg.entity";

@Entity('tb_store')
export class Store extends BaseEntity {

    // 스토어_고유번호
    @PrimaryGeneratedColumn('increment')
    store_idx!: number;

    // 스토어_상호명
    @Column({nullable: true})
    store_name: string;

    // 스토어_사업자등록번호
    @Column({nullable: true})
    store_registnum: string;

    // 스토어_대표자명
    @Column({nullable: true})
    store_ownername: string;

    // 스토어_사업자전화번호
    @Column({nullable: true})
    store_phone: string;

    // 스토어_유형
    @Column({nullable: true})
    store_type: string;

    // 스토어_대표이미지 (원본파일명)
    @Column({nullable: true})
    store_mainimgname: string;

    // 스토어_대표이미지 (유니크명)
    @Column({nullable: true})
    store_mainimgkey: string;

    // 스토어_대표이미지 (경로)
    @Column({nullable: true})
    store_mainimgpath: string;

    // 스토어_서브이미지 JOIN
    @OneToMany(() => Subimg, (subimg) => subimg.store)
    subimg: Subimg[];

    // 스토어_우편번호
    @Column({nullable: true})
    store_postcode: string;

    // 스토어_주소
    @Column({nullable: true})
    store_add: string;

    // 스토어_상세주소
    @Column({nullable: true})
    store_adddetail: string;

    // 스토어_위도
    @Column({nullable: true})
    store_latitude: string;

    // 스토어_경도
    @Column({nullable: true})
    store_longitude: string;

    // 스토어_개장시간
    @Column({nullable: true})
    store_opentime: string;

    // 스토어_마감시간
    @Column({nullable: true})
    store_closetime: string;

    // 스토어_휴무일
    @Column({nullable: true})
    store_offday: string;

    // 스토어_소개정보
    @Column({nullable: true})
    store_info: string;

    // 스토어_키워드
    @Column({nullable: true})
    store_keyword: string;

    // 스토어_점수
    @Column({nullable: true, default: 0})
    store_score: number;

    // 스토어_상태
    @Column({nullable: true})
    store_status: string;

    // 스토어_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    store_createdate!: string;

    // 스토어_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    store_updatedate: string;

    // 스토어_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    store_deletedate: string;

    // 가맹주_이메일 (FK)
    @Column({unique: true})
    user_email: string;

    // 가맹주 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})       // referencedColumnName를 하지 않으니 user_email컬럼 형태를 Integer로 구성하는 문제가 있음
    user: User;

}
