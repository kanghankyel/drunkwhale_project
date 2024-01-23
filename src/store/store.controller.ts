import { Controller, Post, Body, Logger } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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

}
