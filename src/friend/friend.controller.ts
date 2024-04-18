import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { SetFriendDto } from './dto/set-friend.dto';
import { CreateFriendDto } from './dto/create-friend.dto';

@ApiTags('FRIEND 모듈')
@Controller()
export class FriendController {

  constructor(private readonly friendService: FriendService) {}

  private logger = new Logger('friend.controller.ts');

  // 술친구 추천
  @ApiOperation({summary:'술친구 추천', description:'주류월드컵 + 지역 기반 술친구 추천'})
  @ApiBearerAuth()
  @Post('api/set/friend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async setFriends(@Body() setFriendDto: SetFriendDto) {
    return this.friendService.setFriends(setFriendDto);
  }

  // 술친구 메일전송
  @ApiOperation({summary:'술친구 메일전송', description:'술친구 메일 전송'})
  @ApiBearerAuth()
  @Post('api/sendmail/friend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async sendFriendMail(@Body() createFriendDto: CreateFriendDto) {
    return this.friendService.sendFriendMail(createFriendDto);
  }

  // 술친구 메일답장

  // 술친구 메일확인 (본인이 전송한 것)

  // 술친구 메일확인 (자신에게 온 것)

  // 술친구 신고요청
  
}
