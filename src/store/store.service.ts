import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  async requestStore(user_id: string, createStoreDto: CreateStoreDto) {
    const user = await this.userRepository.findOne({where:{user_id}});
    if(!user) {
      throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_id}`)
    }
    const store = new Store();
    store.store_name = createStoreDto.store_name;
    store.store_type = createStoreDto.store_type;
    store.store_phone = createStoreDto.store_phone;
    store.store_regist = createStoreDto.store_regist;
    store.store_postcode = createStoreDto.store_postcode;
    store.store_add = createStoreDto.store_add;
    store.store_adddetail = createStoreDto.store_adddetail;
    store.store_updatedate = null;
    store.user_idx = user.user_idx;
    await this.storeRepository.save(store);
    this.logger.debug(JSON.stringify(user.user_id) + ' 님의 스토어 신청');
    return store;
  }

}
