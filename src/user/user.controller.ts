import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('회원 가입,조회,수정,삭제')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // 회원 생성
  @Post('signin')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const saltOrRounds = 10;    // jwt Salt값
    const hashedPassword = await bcrypt.hash(createUserDto.user_pw, saltOrRounds);    // bcrypt 사용 비밀번호 암호화
    const user = {...createUserDto, user_pw: hashedPassword};
    return this.userService.createUser(user);
  }

  // // 회원 전체 조회
  // @Get()
  // findAllUser() {
  //   return this.userService.findAllUser();
  // }

  // // 회원 하나 조회
  // @Get(':user_id')
  // findOneUser(@Param('user_id') user_id: string) {
  //   return this.userService.findOneUser(user_id);
  // }

  // // 회원 수정
  // @Patch(':user_idx')
  // updateUser(@Param('user_idx') user_idx: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.updateUser(user_idx, updateUserDto);
  // }

  // // 회원 삭제
  // @Delete(':user_idx')
  // removeUser(@Param('user_idx') user_idx: number) {
  //   return this.userService.removeUser(user_idx);
  // }
}
