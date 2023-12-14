import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('USER 모듈')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // 회원 생성
  @ApiOperation({summary:'회원가입', description:'회원가입'})
  @Post('signin')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req): Promise<CreateUserDto> {
    const saltOrRounds = 10;    // jwt Salt값
    const hashedPassword = await bcrypt.hash(createUserDto.user_pw, saltOrRounds);    // bcrypt 사용 비밀번호 암호화
    const clientIP = req.ip;    // 가입자의 IPv6 가져오기
    const user = {...createUserDto, user_pw: hashedPassword, user_ip: clientIP};    // 입력된 정보와, 암호화된 비밀번호, ip를 전송
    return this.userService.createUser(user);
  }

  // 로그인한 회원 마이페이지
  @ApiOperation({summary:'마이페이지', description:'마이페이지 (나의정보)'})
  @ApiBearerAuth()
  @Get('myinfo')
  @UseGuards(JwtAuthGuard)
  async myinfo(@Req() req) {
    const user_id = req.user.user_id;
    const userinfo = await this.userService.findUserInfo(user_id);
    return userinfo;
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
