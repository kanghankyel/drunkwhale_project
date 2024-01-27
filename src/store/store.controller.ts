import { Controller, Post, Body, Logger, Patch, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InputStoreDto } from './dto/input-store.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@ApiTags('Store 모듈')
@Controller()
export class StoreController {

  constructor(private readonly storeService: StoreService) {}

  private logger = new Logger('store.controller.ts');

  // 사업자 스토어 신청
  @ApiOperation({summary:'스토어 신청정보입력', description:'스토어 신청정보입력'})
  @Post('api/create/store')
  async requestStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.requestStore(createStoreDto);
  }

  // 가입허가된 가맹주 개인스토어 정보 기입
  @ApiOperation({summary:'스토어 정보기입', description:'스토어 정보기입'})
  @ApiBearerAuth()
  @Patch('api/input/store')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async inputInfoStore(@Body() inputStoreDto: InputStoreDto) {
    return this.storeService.inputInfoStore(inputStoreDto);
  }

}
