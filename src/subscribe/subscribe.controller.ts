import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, Query, Req } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { RoleEnum } from 'src/role/role.enum';
import { Roles } from 'src/role/role.decorator';
import { PaginationSubscribeDto } from './dto/pagination-subscribe.dto';

@ApiTags('SUBSCRIBE 모듈')
@Controller()
export class SubscribeController {

  constructor(private readonly subscribeService: SubscribeService) {}

  private logger = new Logger('subscribe.controller.ts');

  // 주류 찜하기
  @ApiOperation({summary:'주류 찜하기', description:'주류 찜하기'})
  @ApiBearerAuth()
  @Post('api/subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async subscribeAlcohol(@Body() createSubscribeDto: CreateSubscribeDto) {
    return this.subscribeService.subscribeAlcohol(createSubscribeDto);
  }

  // 주류 찜하기 확인
  @ApiOperation({summary:'찜한 주류 확인', description:'찜한 주류 확인'})
  @ApiBearerAuth()
  @Get('api/read/subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async readSubscribe(@Req() req, @Query() query: PaginationSubscribeDto) {
    const userEmail = req.user.user_email;
    return this.subscribeService.readSubscribe(userEmail, query.page);
  }

  // 주류 찜하기 삭제
  @ApiOperation({summary:'주류 찜하기 삭제', description:'주류 찜하기 삭제'})
  @ApiBearerAuth()
  @Delete('api/delete/subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async deleteSubscribe(@Param('idx') subscribe_idx: number) {
    return this.subscribeService.deleteSubscribe(subscribe_idx);
  }

}
