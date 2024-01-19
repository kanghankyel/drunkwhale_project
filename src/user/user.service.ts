import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { InputUserDto } from './dto/input-user.dto';

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>, 
    @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>,
    private roleService: RoleService,
    ) {};
  
  private logger = new Logger('user.service.ts');

  // 회원 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {user_email, user_pw, user_name, user_nickname, user_phone, user_postcode, user_add, user_adddetail, user_birth, user_gender, user_ip} = createUserDto;
    const usercheck = await this.userRepository.findOne({where:{user_email}});
    if(usercheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 번호 : ${user_email}`);    // 중복된 아이디 체크
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
        user_birth,
        user_gender,
        user_ip,
    });
    await this.userRepository.save(user);   // 저장하고 반환
    await this.roleService.createDefaultRole(user);   // 기본권한 지급
    return user;
  }

  // 회원가입 추가 정보기입
  async inputUser(user_email: string, inputUserDto: InputUserDto): Promise<User> {
    const user = await this.userRepository.findOne({where:{user_email}});
    if(!user) {
      throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_email}`);
    }
    const inputPhone = inputUserDto.user_phone;
    const checkPhone = await this.userRepository.findOne({where:{user_phone:inputPhone}});
    if(checkPhone) {
      throw new ConflictException(`이미 등록된 전화번호 입니다. 입력된 전화번호 : ${inputPhone}`);
    }
    this.logger.debug('회원 추가정보 반영 전 : ' + JSON.stringify(user));
    user.user_nickname = inputUserDto.user_nickname;
    user.user_phone = inputUserDto.user_phone;
    user.user_birth = inputUserDto.user_birth;
    user.user_gender = inputUserDto.user_gender;
    user.user_postcode = inputUserDto.user_postcode;
    user.user_add = inputUserDto.user_add;
    user.user_adddetail = inputUserDto.user_adddetail;
    this.logger.debug('회원 추가정보 반영 후 : ' + JSON.stringify(user));
    const updatedUser = await this.userRepository.save(user);
    // this.logger.debug('회원 추가정보 저장 후 : ' + JSON.stringify(updatedUser));
    return updatedUser;
  }

}
