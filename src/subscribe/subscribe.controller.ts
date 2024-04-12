import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { RoleEnum } from 'src/role/role.enum';
import { Roles } from 'src/role/role.decorator';

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


}
