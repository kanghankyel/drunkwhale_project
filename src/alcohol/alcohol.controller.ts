import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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
        alcohol_type: {type: 'string'},
        alcohol_class: {type: 'string'},
        alcohol_from: {type: 'string'},
        alcohol_percent: {type: 'string'},
        alcohol_info: {type: 'string'},
        user_email: {type: 'string'},
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
  async readAlcohol() {
    return this.alcoholService.getReadAlcohol();
  }

}
