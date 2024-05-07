import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAlcoholDto } from './dto/update-alcohol.dto';
import { Alcohol } from './entities/alcohol.entity';
import { PaginationAlcoholDto } from './dto/pagination-alcohol.dto';
import { CreateWeekbottleDto } from './dto/create-weekbottle.dto';

@ApiTags('Alcohol 모듈')
@Controller()
export class AlcoholController {

  constructor(private readonly alcoholService: AlcoholService) {}

  private logger = new Logger('alcohol.controller.ts');

  // 주류 정보입력(관리자)
  @ApiOperation({summary:'주류 정보등록', description:'주류 정보등록'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        alcohol_image: {type: 'string', format: 'binary'},
        alcohol_name: {type: 'string'},
        alcohol_ename: {type: 'string'},
        alcohol_type: {type: 'string'},
        alcohol_class: {type: 'string'},
        alcohol_from: {type: 'string'},
        alcohol_percent: {type: 'string'},
        alcohol_manufacturer: {type: 'string'},
        alcohol_importer: {type: 'string'},
        alcohol_color: {type: 'string'},
        alcohol_woody: {type: 'string'},
        alcohol_cereal: {type: 'string'},
        alcohol_painty: {type: 'string'},
        alcohol_floral: {type: 'string'},
        alcohol_winy: {type: 'string'},
        alcohol_pitty: {type: 'string'},
        alcohol_sulper: {type: 'string'},
        alcohol_fruity: {type: 'string'},
        alcohol_info: {type: 'string'},
      },
    },
  })
  @ApiBearerAuth()
  @Post('api/create/alcohol')
  @UseInterceptors(FileInterceptor('alcohol_image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async createAlcohol(@UploadedFile() file, @Body() createAlcoholDto: CreateAlcoholDto) {
    return this.alcoholService.createAlcohol(createAlcoholDto, file);
  }

  // 등록된 주류 정보보기
  @ApiOperation({summary:'주류 정보보기', description:'주류 정보보기'})
  @Get('api/read/alcohol')
  async readAlcohol(@Query() query: PaginationAlcoholDto) {
    return this.alcoholService.getReadAlcohol(query.page);
  }

  // 등록된 주류 상세보기
  @ApiOperation({summary:'주류 상세보기', description:'주류 상세보기'})
  @Get('api/read/alcohol/detail/:idx')
  async readAlcoholDetail(@Param('idx') idx: number) {
    return this.alcoholService.getReadAlcoholDetail(idx);
  }

  // 주류 정보수정(관리자)
  @ApiOperation({summary:'주류 정보수정', description:'주류 정보수정'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        alcohol_idx: {type: 'number'},
        alcohol_image: {type: 'string', format: 'binary'},
        alcohol_name: {type: 'string'},
        alcohol_ename: {type: 'string'},
        alcohol_type: {type: 'string'},
        alcohol_class: {type: 'string'},
        alcohol_from: {type: 'string'},
        alcohol_percent: {type: 'string'},
        alcohol_manufacturer: {type: 'string'},
        alcohol_importer: {type: 'string'},
        alcohol_color: {type: 'string'},
        alcohol_woody: {type: 'string'},
        alcohol_cereal: {type: 'string'},
        alcohol_painty: {type: 'string'},
        alcohol_floral: {type: 'string'},
        alcohol_winy: {type: 'string'},
        alcohol_pitty: {type: 'string'},
        alcohol_sulper: {type: 'string'},
        alcohol_fruity: {type: 'string'},
        alcohol_info: {type: 'string'},
      },
    },
  })
  @ApiBearerAuth()
  @Patch('api/update/alcohol')
  @UseInterceptors(FileInterceptor('alcohol_image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async updateAlcohol(@UploadedFile() file, @Body() updateAlcoholDto: UpdateAlcoholDto) {
    return this.alcoholService.updateAlcohol(updateAlcoholDto, file);
  }

  // 등록된 주류 삭제
  @ApiOperation({summary:'주류 삭제', description:'주류 삭제'})
  @ApiBearerAuth()
  @Delete('api/delete/alcohol')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async deleteAlcohol(@Param('idx') alcohol_idx: number) {
    return this.alcoholService.deleteAlcohol(alcohol_idx);
  }

  // 주간보틀 생성
  @ApiOperation({summary:'주간보틀 생성', description:'주간보틀 생성'})
  @ApiBearerAuth()
  @Post('api/create/weekbottle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async setWeekBottle(@Body() createWeekBottleDto: CreateWeekbottleDto) {
    return this.alcoholService.setWeekBottle(createWeekBottleDto);
  }

  // 주간보틀 홈화면
  @ApiOperation({summary:'주간보틀 홈화면', description:'주간보틀 홈화면'})
  @Get('api/get/weekbottle')
  async getWeekBottle() {
    return this.alcoholService.getWeekBottle();
  }

}
