import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { request } from 'http';

@Injectable()
export class UserService {

  constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) {};

  // 회원 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {user_id, user_pw, user_name, user_email, user_ip} = createUserDto;
    const usercheck = await this.userRepository.findOne({where:{user_id}});
    if(usercheck) {
      throw new ConflictException(`이미 등록된 회원입니다. 입력하신 번호 : ${user_id}`);    // 중복된 아이디 체크
    }
    const result = this.userRepository.create({
        user_id,
        user_pw,
        user_name,
        user_email,
        user_ip,
    });
    await this.userRepository.save(result);   // 저장하고 반환
    return result;
  }

  // // 회원 전체 조회
  // async findAllUser(): Promise<User[]> {
  //   return await this.userRepository.find();
  // }

  // 회원 정보 하나 검색 (마이페이지)
  async findUserInfo(user_id: string): Promise<User> {
    const userdata = await this.userRepository.findOne({
      select: {user_id:true, user_phone:true, user_email:true},
      where:{user_id},
    });   // 해당 데이터 검색
    if(!userdata) {
      throw new NotFoundException(`해당 ID는 존재하지 않습니다. 입력된 ID : ${user_id}`);    // 일치하지 않는 값 입력시 오류 반환
    }
  return userdata;
  }

  // // 회원 수정
  // async updateUser(user_idx: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   const userdata = await this.userRepository.findOne({where:{user_idx}});   // 해당 데이터 검색
  //   if(!userdata) {
  //     throw new NotFoundException(`해당 ID는 존재하지 않습니다. 입력하신 ID : ${user_idx}`);    // 일치하지 않는 값 입력시 오류 반환
  //   }
  //   await this.userRepository.update(user_idx, updateUserDto);    // 업데이트
  //   return await this.userRepository.findOne({where:{user_idx}});   // 업데이트된 항목 반환
  // }

  // // 회원 삭제
  // async removeUser(user_idx: number): Promise<any> {
  //   try {
  //     const userdata = await this.userRepository.findOne({where:{user_idx}});   // 해당 데이터 검색
  //     if(!userdata) {
  //       return {message: `해당하는 ID가 없습니다. 입력하신 ID : ${user_idx}`, error: true, statusCode: 404};    // 일치하지 않는 값 입력시 오류 반환
  //     }
  //     await this.userRepository.delete(user_idx);
  //     return {message: `삭제가 완료되었습니다. 삭제된 ID : ${user_idx}`, deleted: true, error: false, statusCode: 200};    // 삭제 성공 여부 반환
  //   } catch (error) {
  //     return {message: '삭제에 실패하였습니다. 다시 시도해주십시오.', deleted: false, error: true, statusCode: 500};    // 삭제 실패 여부 반환
  //   }
  // }
}
