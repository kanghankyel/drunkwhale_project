import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_dog')
export class Dog extends BaseEntity {

    // 강아지_고유번호
    @PrimaryGeneratedColumn()
    dog_idx!: number;

    // 강아지_이름
    @Column({nullable: true})
    dog_name: string;

    // 강아지_성별
    @Column({nullable: true})
    dog_gender: string;

    // 강아지_종
    @Column({nullable: true})
    dog_species: string;

    // 강아지_크기
    @Column({nullable: true})
    dog_size: string;

    // 강아지_생일
    @Column({nullable: true})
    dog_birth: string;

    // 강아지_성격
    @Column({nullable: true})
    dog_personality: string;

    // 강아지_간략소개
    @Column({nullable: true})
    dog_info: string;

    // 강아지_상태
    @Column({default: 'A'})     // 초기값 'A' = 활동중
    dog_status: string;

    // 강아지_생성일
    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    dog_createdate: string;

    // 강아지_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    dog_updatedate: string;

    // 강아지_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    dog_deletedate: string;

    // 회원_고유번호(FK)
    @Column()
    user_idx: number;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_idx'})
    user: User;

    // 이 방식은 회원의 모든 정보까지 다 받아와서 게시하기 때문에 일단은 55줄~62줄로 대체
    // @ManyToOne(() => User, (user) => user.dogs)
    // @JoinColumn({name: 'user_idx', referencedColumnName: 'user_idx'})
    // user: User;

}
