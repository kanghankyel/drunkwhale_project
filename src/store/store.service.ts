import { ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { InputStoreDto } from './dto/input-store.dto';

@Injectable()
export class StoreService {

  constructor(
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('store.service.ts');

  // 사업자 스토어 신청
  async requestStore(createStoreDto: CreateStoreDto) {
    try {
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
      return {message:'스토어 가입신청완료', data:store, statusCode:200};
    } catch (error) {
      this.logger.error('스토어 정보 입력 중 서버 문제 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 가입허가된 가맹주 개인스토어 정보 기입
  async inputInfoStore(inputStoreDto: InputStoreDto) {
    try {
      const {store_opentime, store_closetime, store_info, user_email} = inputStoreDto;
      const store = await this.storeRepository.findOne({where:{user_email, store_status:'A'}});
      if(!store) {
        return {message:`일치하는 스토어가 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      store.store_opentime = inputStoreDto.store_opentime;
      store.store_closetime = inputStoreDto.store_closetime;
      store.store_info = inputStoreDto.store_info;
      const inputStore = await this.storeRepository.save(store);
      return {
        message:'스토어 정보 입력입력이 완료되었습니다.',
        data:{store_name:inputStore.store_name, store_opentime:inputStore.store_opentime, store_closetime:inputStore.store_closetime},
        statusCode:200
      };
    } catch (error) {
      this.logger.error('개인스토어 정보 기입 중 서버 문제 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
