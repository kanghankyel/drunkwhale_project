import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { InputUserDto } from './dto/input-user.dto';
import { CreateOwnerDto } from './dto/create_owner.dto';

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>, 
    @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>,
    private roleService: RoleService,
  ) {};
  
  private logger = new Logger('user.service.ts');

  // 회원 생성
  async createUser(createUserDto: CreateUserDto) {
    const {user_email, user_pw, user_name, user_nickname, user_phone, user_postcode, user_add, user_adddetail, user_ip, user_status} = createUserDto;
    const userEmailCheck = await this.userRepository.findOne({where:{user_email, user_status:In(['A', 'B'])}});
    const userPhoneCheck = await this.userRepository.findOne({where:{user_phone, user_status:In(['A', 'B'])}});
    const userEamilCheckOwner = await this.userRepository.findOne({where:{user_email, user_status:In(['Z', 'Y', 'W'])}});
    if(userEmailCheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 계정 : ${user_email}`);    // 중복된 아이디 체크
    }
    if(userPhoneCheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 번호 : ${user_phone}`);    // 중복된 전화번호 체크
    }
    if(userEamilCheckOwner) {
      throw new ConflictException(`가맹회원은 일반회원에 등록하지 못합니다. 입력하신 계정 : ${user_email}`);    // 중복된 아이디 체크(가맹회원중에 있는지도 검사)
    }
    const user = this.userRepository.create({
        user_email,
        user_pw,
        user_name,
        user_nickname,
        user_phone,
        user_postcode,
        user_add,
        user_adddetail,
        user_ip,
        user_status: 'A',   // 회원가입 시 기본 상태값 지정 ( A = 일반회원 활동중 )
        user_updatedate: null,    //  updateColumn 초기값으로 Null 지정
    });
    await this.userRepository.save(user);   // 저장하고 반환
    await this.roleService.createDefaultRole(user);   // 기본권한 지급
    return {message:'회원가입완료', data:user, statusCode:200};
  }

  // 이메일로 회원 정보 찾기
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      relations: ['roles'],
      select: ['user_idx', 'user_email', 'roles'],
      where: {user_email: email}
    });
    if (user && user.roles) {
      user.roles = user.roles.map(role => ({role_type: role.role_type}));
    }
    return user;
  }

  // 현재 소셜로그인 방식의 차이로 쓰이지 않음.
  // 회원가입 추가 정보기입
  // async inputUser(user_email: string, inputUserDto: InputUserDto): Promise<User> {
  //   const user = await this.userRepository.findOne({where:{user_email}});
  //   if(!user) {
  //     throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_email}`);
  //   }
  //   const inputPhone = inputUserDto.user_phone;
  //   const checkPhone = await this.userRepository.findOne({where:{user_phone:inputPhone}});
  //   if(checkPhone) {
  //     throw new ConflictException(`이미 등록된 전화번호 입니다. 입력된 전화번호 : ${inputPhone}`);
  //   }
  //   this.logger.debug('회원 추가정보 반영 전 : ' + JSON.stringify(user));
  //   user.user_nickname = inputUserDto.user_nickname;
  //   user.user_phone = inputUserDto.user_phone;
  //   user.user_postcode = inputUserDto.user_postcode;
  //   user.user_add = inputUserDto.user_add;
  //   user.user_adddetail = inputUserDto.user_adddetail;
  //   this.logger.debug('회원 추가정보 반영 후 : ' + JSON.stringify(user));
  //   const updatedUser = await this.userRepository.save(user);
  //   return updatedUser;
  // }

  // 회원정보 수정
  async updateUser(updateUserDto: UpdateUserDto) {
    try {
      const {user_email, user_newemail, user_pw, user_nickname, user_phone, user_postcode, user_add, user_adddetail} = updateUserDto;
      const user = await this.userRepository.findOne({where:{user_email: user_email}});
      if (!user) {
        throw new NotFoundException(`해당 회원이 존재하지 않습니다. 입력된 회원 : ${user_email}`);
      }
      if (user_newemail && user_newemail !== user.user_email) {
        // 새로운 이메일이 기존 이메일과 다르고, 다른 회원의 이메일과 중복되는지 확인
        const existEmail = await this.userRepository.findOne({where:{user_email: user_newemail}});
        if (existEmail) {
          throw new ConflictException(`이미 등록된 이메일입니다. 입력된 새로운 이메일 ${user_newemail}`)
        }
        // 중복되지 않는다면 새로운 이메일로 회원 정보 업데이트
        user.user_email = user_newemail;
      }
      if (user_phone && user_phone !== user.user_phone) {
        const existPhone = await this.userRepository.findOne({where:{user_phone: user_phone}});
        if (existPhone) {
          throw new ConflictException(`이미 등록된 전화번호입니다. 입력된 전화번호 : ${user_phone}`);
        }
      }
      // 입력된 정보가 있으면 업데이트, 없으면 기존 비밀번호 유지
      if (user_pw) user.user_pw = user_pw;
      if (user_nickname) user.user_nickname = user_nickname;
      if (user_postcode) user.user_postcode = user_postcode;
      if (user_add) user.user_add = user_add;
      if (user_adddetail) user.user_adddetail = user_adddetail;
      const updatedUser = await this.userRepository.save(user);   // 업데이트된 회원 정보 저장
      return {message: `회원정보수정완료`, data: updatedUser, statusCode: 200}
    } catch (error) {
      this.logger.error('회원정보 수정중 오류발생');
      this.logger.error(error);
      return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
    }
  }

  // #########################################################################################################
  // ######################################     아래는 가맹회원 로직    ###########################################
  // #########################################################################################################

  // 가맹회원 가입신청
  async createOwner(createOwnerDto: CreateOwnerDto) {
    const {user_email, user_pw, user_name, user_nickname, user_phone, user_ip, user_status} = createOwnerDto;
    const ownerEmailCheck = await this.userRepository.findOne({where:{user_email, user_status:In(['Z', 'Y', 'W'])}});
    const ownerPhoneCheck = await this.userRepository.findOne({where:{user_phone, user_status:In(['Z', 'Y', 'W'])}});
    const ownerEamilCheckUser = await this.userRepository.findOne({where:{user_email, user_status:In(['A', 'B'])}});
    if(ownerEmailCheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 계정 : ${user_email}`);    // 중복된 아이디 체크
    }
    if(ownerPhoneCheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 번호 : ${user_phone}`);    // 중복된 전화번호 체크
    }
    if(ownerEamilCheckUser) {
      throw new ConflictException(`이미 등록된 일반회원 계정이 있습니다. 일반회원탈퇴 후 다시 등록해주세요. 입력하신 계정 : ${user_email}`);    // 중복된 아이디 체크(일반회원중에 있는지도 검사)
    }
    const owner = this.userRepository.create({
      user_email,
      user_pw,
      user_name,
      user_nickname,
      user_phone,
      user_ip,
      user_status: 'W',   // 가맹회원가입 시 기본 상태값 지정 ( W = 가맹회원 신청가입대기중 )
      user_updatedate: null,    //  updateColumn 초기값으로 Null 지정
    });
    await this.userRepository.save(owner);
    return {message:'가맹회원 신청가입완료', data:owner, statusCode:200};
  }

}
