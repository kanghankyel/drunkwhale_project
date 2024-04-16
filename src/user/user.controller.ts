import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Put, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { RoleEnum } from 'src/role/role.enum';
import { User } from './entities/user.entity';
import { Roles } from 'src/role/role.decorator';
import { InputUserDto } from './dto/input-user.dto';
import { CreateOwnerDto } from './dto/create_owner.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('USER 모듈')
@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  private logger = new Logger('user.controller.ts');

  // 회원 생성
  @ApiOperation({summary:'회원가입', description:'회원가입'})
  @Post('api/user/signin')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
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

  // 현재 소셜로그인 방식의 차이로 쓰이지 않음.
  // 회원가입 추가 정보기입
  // @ApiOperation({summary:'회원필수정보 추가기입. 백엔드 전용. ###현재사용X', description:'회원필수정보 추가기입'})
  // @Patch('user/moreinfo/:user_email')
  // async inputUser(@Param('user_email') user_email: string, @Body() inputUserDto: InputUserDto) {
  //   return this.userService.inputUser(user_email, inputUserDto);
  // }

  // 로그인한 회원(ROLE_USER) 마이페이지
  @ApiOperation({summary:'마이페이지', description:'마이페이지 (나의정보)'})
  @ApiBearerAuth()
  @Get('api/user/myinfo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async myinfo(@Req() req) {
    const userinfo: any = req.user;
    return userinfo;
  }

  // 로그인한 회원(ROLE_ADMIN) 마이페이지
  @ApiOperation({summary:'마이페이지(관리자)', description:'마이페이지 (관리자정보)'})
  @ApiBearerAuth()
  @Get('api/user/admininfo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async admininfo(@Req() req) {
    const userinfo: any = req.user;
    return userinfo;
  }

  // 회원정보 수정
  @ApiOperation({summary:'회원정보수정', description:'회원정보 수정'})
  @ApiBearerAuth()
  @Patch('api/user/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async userupdate(@Body() updateUserDto: UpdateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(updateUserDto.user_pw, saltOrRounds);
    const user = {...updateUserDto, user_pw: hashedPassword};
    return this.userService.updateUser(user);
  }

  // 회원탈퇴
  @ApiOperation({summary:'회원탈퇴', description:'회원탈퇴'})
  @ApiBearerAuth()
  @Patch('api/user/signout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async signout(@Body() {user_email}) {
    return this.userService.signout(user_email);
  }

  // #########################################################################################################
  // ######################################     아래는 가맹회원 로직    ###########################################
  // #########################################################################################################

  // 가맹회원 가입신청
  @ApiOperation({summary:'가맹회원 가입신청', description:'가맹회원 가입신청'})
  @Post('api/owner/signin')
  async createOwner(@Body() createOwnerDto: CreateOwnerDto, @Req() req) {
    const saltOrRounds = 10;    // jwt Salt값
    const hashedPassword = await bcrypt.hash(createOwnerDto.user_pw, saltOrRounds);    // bcrypt 사용 비밀번호 암호화
    const clientIP = req.ip;    // 가입자의 IPv6 가져오기
    const owner = {
      ...createOwnerDto,
      user_pw: hashedPassword,
      user_ip: clientIP,    // 입력된 정보와, 암호화된 비밀번호, ip를 전송
    };
    return this.userService.createOwner(owner);
  }
  
}
