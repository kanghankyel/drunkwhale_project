import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, Req, Query } from '@nestjs/common';
import { CabinetService } from './cabinet.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { PaginationCabinetDto } from './dto/pagination-cabinet.dto';

@ApiTags('CABINET 모듈')
@Controller()
export class CabinetController {

  constructor(private readonly cabinetService: CabinetService) {}

  private logger = new Logger('cabinet.controller.ts');

  // 개인 술장고 입력
  @ApiOperation({summary:'개인 술장고 입력', description:'개인 술장고 입력'})
  @ApiBearerAuth()
  @Post('api/create/cabinet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async createCabinet(@Body() createCabinetDto: CreateCabinetDto) {
    return this.cabinetService.createCabinet(createCabinetDto);
  }

  // 개인 술장고 읽기
  @ApiOperation({summary:'개인 술장고 읽기', description:'개인 술장고 읽기'})
  @ApiBearerAuth()
  @Get('api/read/cabinet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async readCabinet(@Req() req, @Query() query: PaginationCabinetDto) {
    const userEmail = req.user.user_email;
    return this.cabinetService.readCabinet(userEmail, query.page);
  }

  // 개인 술장고 수정
  @ApiOperation({summary:'개인 술장고 수정', description:'개인 술장고 수정'})
  @ApiBearerAuth()
  @Patch('api/update/cabinet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async updateCabinet(@Body() updateCabinetDto: UpdateCabinetDto) {
    return this.cabinetService.updateCabinet(updateCabinetDto);
  }

  // 개인 술장고 삭제
  @ApiOperation({summary:'개인 술장고 삭제', description:'개인 술장고 삭제'})
  @ApiBearerAuth()
  @Delete('api/delete/cabinet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async deleteCabinet(@Param('idx') cabinet_idx: number) {
    return this.cabinetService.deleteCabinet(cabinet_idx);
  }

}
