import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Admin } from './entities/admin.entity';
import { RoleService } from 'src/role/role.service';
import { Store } from 'src/store/entities/store.entity';

@Injectable()
export class AdminService {
  
  constructor(
    @Inject('ADMIN_REPOSITORY') private adminRepository: Repository<Admin>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>,
    private roleService: RoleService,
  ) {};

  private logger = new Logger('admin.service.ts');

  // 가맹회원+가맹스토어 신청 허가
  async approveOwnerStore(user_email: string) {
    try {
      const user = await this.userRepository.findOne({where:{user_email: user_email}});
      const store = await this.storeRepository.findOne({where:{user_email: user_email}});
      if(!user || !store) {
        this.logger.error(`일치하는 가맹회원 또는 가맹스토어가 존재하지 않습니다.`);
        return {message:`일치하는 가맹회원 또는 가맹스토어가 존재하지 않습니다.`, statusCode:404};
      }
      if(user.user_status !== 'W') {
        this.logger.error(`이미 가입되었거나, 접근불가한 회원입니다. 회원상태 : (${user.user_status})`);
        return {message:`이미 가입되었거나, 접근불가한 회원입니다. 회원상태 : (${user.user_status})`, statusCode:404};
      }
      if(store.store_status !== 'W') {
        this.logger.error(`이미 가입되었거나, 접근불가한 스토어입니다. 스토어상태 : (${store.store_status})`);
        return {message:`이미 가입되었거나, 접근불가한 스토어입니다. 스토어상태 : (${store.store_status})`, statusCode:404};
      }
      if(user.user_email == store.user_email && user.user_status == 'W' && store.store_status == 'W') {
        this.logger.debug(`가맹회원 허가 전 정보 : `);
        this.logger.debug(`회원코드 = [${user.user_idx}], 회원계정 = [${user.user_email}], 회원상태 = [${user.user_status}]`);
        this.logger.debug(`가맹스토어 허가 전 정보 : `);
        this.logger.debug(`스토어코드 = [${store.store_idx}], 스토어회원계정 = [${store.user_email}], 스토어상태 = [${store.store_status}]`);
        user.user_status = 'Z';   // 가맹회원신청대기상태 'W'  =>  가맹회원활동중상태 'Z' 로 수정.
        store.store_status = 'A';   // 회원스토어신청대기상태 'W'  =>  회원스토어활동중상태 'A' 로 수정.
        const approveUser = await this.userRepository.save(user);
        const approveStore = await this.storeRepository.save(store);
        const giveOwnerRole = await this.roleService.giveOwnerRole(user);   // 가맹회원 'ROLE_OWNER'권한 지급
        return {
          message:'가맹회원과 가맹스토어 신청허가 완료되었습니다.',
          data:{
            user_idx:approveUser.user_idx,
            store_idx:approveStore.store_idx,
            user_email:approveUser.user_email,
            user_status:approveUser.user_status,
            store_status:approveStore.store_status,
            role_type:giveOwnerRole.role_type,
          },
          statusCode:200,
        };
      } else {
        this.logger.error('예기치 않은 오류 발생.');
      }
    } catch (error) {
      if(error.response && error.response.status === 500) {
        this.logger.error('가맹주&스토어 신청 중 서버 문제 발생.');
        this.logger.error(`에러내용 : ${error}`);
        console.log(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
      }
    } 
  }

}
