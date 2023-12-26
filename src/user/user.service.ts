import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  // 회원 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {user_id, user_pw, user_name, user_email, user_ip} = createUserDto;
    const usercheck = await this.userRepository.findOne({where:{user_id}});
    if(usercheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 번호 : ${user_id}`);    // 중복된 아이디 체크
    }
    const user = this.userRepository.create({
        user_id,
        user_pw,
        user_name,
        user_email,
        user_ip,
    });
    await this.userRepository.save(user);   // 저장하고 반환
    await this.roleService.createDefaultRole(user);   // 기본권한 지급
    return user;
  }

  // 회원가입 추가 정보기입
  async inputUser(user_id: string, inputUserDto: InputUserDto): Promise<User> {
    const user = await this.userRepository.findOne({where:{user_id}});
    if(!user) {
      throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_id}`);
    }
    // console.log('회원 추가정보 반영 전 : ', user);
    user.user_phone = inputUserDto.user_phone;
    user.user_birth = inputUserDto.user_birth;
    user.user_gender = inputUserDto.user_gender;
    user.user_postcode = inputUserDto.user_postcode;
    user.user_add = inputUserDto.user_add;
    user.user_adddetail = inputUserDto.user_adddetail;
    // console.log('회원 추가정보 반영 후 : ', user);
    const updatedUser = await this.userRepository.save(user);
    // console.log('회원 추가정보 저장 후 : ', updatedUser);
    return updatedUser;
  }

}
