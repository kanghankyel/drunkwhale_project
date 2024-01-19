import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Store 모듈')
@Controller('store')
export class StoreController {

  constructor(private readonly storeService: StoreService) {}

  private logger = new Logger('store.controller.ts');

  // 사업자 스토어 신청
  @ApiOperation({summary:'스토어 신청정보입력', description:'스토어 신청정보입력'})
  @ApiBearerAuth()
  @Post('request/:user_email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async requestStore(@Param('user_email') user_email: string, @Body() createStoreDto: CreateStoreDto) {
    return this.storeService.requestStore(user_email, createStoreDto);
  }

}
