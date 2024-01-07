import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Put, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { RoleEnum } from 'src/role/role.enum';
import { User } from './entities/user.entity';
import { Roles } from 'src/role/role.decorator';
import { InputUserDto } from './dto/input-user.dto';

@ApiTags('USER 모듈')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  private logger = new Logger('user.controller.ts');

  // 회원 생성
  @ApiOperation({summary:'회원가입', description:'회원가입'})
  @Post('signin')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req): Promise<User> {
    const saltOrRounds = 10;    // jwt Salt값
    const hashedPassword = await bcrypt.hash(createUserDto.user_pw, saltOrRounds);    // bcrypt 사용 비밀번호 암호화
    const clientIP = req.ip;    // 가입자의 IPv6 가져오기
    const user = {
      ...createUserDto,
      user_pw: hashedPassword,
      user_ip: clientIP,    // 입력된 정보와, 암호화된 비밀번호, ip를 전송
    };
    return this.userService.createUser(user);
  }

  // 회원가입 추가 정보기입
  @ApiOperation({summary:'회원추가정보', description:'회원추가정보'})
  @Patch('moreinfo/:user_id')
  async inputUser(@Param('user_id') user_id: string, @Body() inputUserDto: InputUserDto) {
    return this.userService.inputUser(user_id, inputUserDto);
  }

  // 로그인한 회원(ROLE_USER) 마이페이지
  @ApiOperation({summary:'마이페이지', description:'마이페이지 (나의정보)'})
  @ApiBearerAuth()
  @Get('myinfo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async myinfo(@Req() req) {
    const userinfo: any = req.user;
    return userinfo;
  }

  // 로그인한 회원(ROLE_ADMIN) 마이페이지
  @ApiOperation({summary:'마이페이지(관리자)', description:'마이페이지 (관리자정보)'})
  @ApiBearerAuth()
  @Get('admininfo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async admininfo(@Req() req) {
    const userinfo: any = req.user;
    return userinfo;
  }
  
}
