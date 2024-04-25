import { Controller, Post, Body, Logger, Patch, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InputStoreDto } from './dto/input-store.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Store 모듈')
@Controller()
export class StoreController {

  constructor(private readonly storeService: StoreService) {}

  private logger = new Logger('store.controller.ts');

  // 사업자 스토어 신청 (가맹회원 가입시 해당 정보를 입력하는 로직으로 통합함으로 현재는 사용되지 않음)
  // @ApiOperation({summary:'스토어 신청정보입력', description:'스토어 신청정보입력'})
  // @Post('api/create/store')
  // async requestStore(@Body() createStoreDto: CreateStoreDto) {
  //   return this.storeService.requestStore(createStoreDto);
  // }

  // 가입허가된 가맹주 개인스토어 정보 기입
  @ApiOperation({summary:'스토어 정보기입', description:'스토어 정보기입'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        store_mainimg: {type: 'string', format: 'binary'},
        store_subimg: {type: 'array', items: {type: 'string', format: 'binary'}, maxItems: 10},
        store_opentime: {type: 'string'},
        store_closetime: {type: 'string'},
        store_info: {type: 'string'},
        user_email: {type: 'string'},
      },
    },
  })
  @ApiBearerAuth()
  @Patch('api/input/store')
  @UseInterceptors(FileFieldsInterceptor([    // FileFieldsInterceptor 사용 ( FileInterceptor, FilesInterceptor 가 이님을 유의 )
    {name:'store_mainimg', maxCount:1},
    {name:'store_subimg', maxCount:10},
  ]))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async inputTest(@UploadedFiles() files, @Body() inputStoreDto: InputStoreDto) {
    const {store_mainimg, store_subimg} = files;
    // const mainimg = store_mainimg[0];
    // const subimg = store_subimg.map(file => file);
    const mainimg = store_mainimg ? store_mainimg[0] : undefined;   // mainimg가 전송되지 않았을때 undefined처리
    const subimg = store_subimg ? store_subimg.map(file => file) : [];    // subimg가 전송되지 않았을때 undefined처리
    return this.storeService.inputInfoStore(mainimg, subimg, inputStoreDto);
  }


}
