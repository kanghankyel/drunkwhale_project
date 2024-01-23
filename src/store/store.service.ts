import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StoreService {

  constructor(
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('store.service.ts');

  // 사업자 스토어 신청
  async requestStore(createStoreDto: CreateStoreDto) {
    const {store_name, store_registnum, store_ownername, store_phone, store_type, store_postcode, store_add, store_adddetail, store_status, user_email} = createStoreDto;
    const storeCheckInWithdrawn = await this.storeRepository.findOne({where:{store_registnum, store_status:'W'}});
    if(storeCheckInWithdrawn) {
      throw new ConflictException(`이미 신청대기중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`);
    }
    const storeCheckInActive = await this.storeRepository.findOne({where:{store_registnum, store_status:'A'}});
    if(storeCheckInActive) {
      throw new ConflictException(`이미 활동중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`);
    }
    // const storeCheckUser = await this.storeRepository.findOne({where:{user_email}});
    // if(!storeCheckUser) {
    //   throw new NotFoundException(`해당 회원은 회원테이블에 등록되지 않은 회원입니다. 입력된 회원 : ${user_email}`);
    // }
    const store = this.storeRepository.create({
      store_name,
      store_registnum,
      store_ownername,
      store_phone,
      store_type,
      store_postcode,
      store_add,
      store_adddetail,
      store_status: 'W',   // 점포가입신청 시 기본 상태값 지정 ( W = 가맹회원 신청가입대기중 )
      store_updatedate: null,    //  updateColumn 초기값으로 Null 지정
      user_email,
    });
    await this.storeRepository.save(store);
    return store;
  }

}
