import { Dog } from "src/dog/entities/dog.entity";
import { Role } from "src/role/entities/role.entity";
import { Store } from "src/store/entities/store.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_user')
export class User extends BaseEntity {

    // 회원_고유번호
    @PrimaryGeneratedColumn('increment')
    user_idx!: number;      // '!' 느낌표가 붙은 거는 이 프로퍼티가 null 또는 undefined가 아니라는 것을 단언하는 것

    // 회원_이메일(ID)
    @Column({unique: true})
    user_email!: string;

    // 회원_비밀번호
    @Column({nullable: true})
    user_pw: string;

    // 회원_이름
    @Column({nullable: true})
    user_name: string;

    // 회원_닉네임
    @Column({nullable: true})
    user_nickname: string;
    
    // 회원_전화번호
    @Column({unique: true, nullable: true})
    user_phone: string;

    // 회원_우편번호
    @Column({nullable: true})
    user_postcode: string;

    // 회원_주소
    @Column({nullable: true})
    user_add: string;

    // 회원_상세주소
    @Column({nullable: true})
    user_adddetail: string;

    // 회원_아이피
    @Column({nullable: true})
    user_ip: string;

    // 회원_상태
    @Column({nullable: true})
    user_status: string;

    // 회원_생성일
    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    user_createdate!: string;

    // 회원_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    user_updatedate: string;

    // 회원_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    user_deletedate: string;

    // 권한 JOIN
    @OneToMany(type => Role, role => role.user)     // {eager: true}
    roles?: any[];

    // 가맹점포 JOIN
    @OneToMany(() => Store, (store) => store.user)
    store: Store[];

    // 강아지 JOIN
    @OneToMany(() => Dog, (dog) => dog.user)
    dogs: Dog[];

}