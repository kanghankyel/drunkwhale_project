import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { WorldcupService } from './worldcup.service';
import { CreateWorldcupDto } from './dto/create-worldcup.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@Controller()
export class WorldcupController {

  constructor(private readonly worldcupService: WorldcupService) {}

  private logger = new Logger('worldcup.controller.ts');

  // 주류월드컵(32강)
  @ApiOperation({summary:'주류월드컵(32강)', description:'주류월드컵(32강) 주류 선정'})
  @ApiBearerAuth()
  @Get('api/get/worldcup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async getWorldcup() {
    return this.worldcupService.getWorldcup();
  }

  // 주류월드컵 결과 전송
  @ApiOperation({summary:'주류월드컵 결과 전송', description:'주류월드컵 결과 전송'})
  @ApiBearerAuth()
  @Post('api/save/worldcup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async saveWorldcup(@Body() createWorldcupDto: CreateWorldcupDto) {
    return this.worldcupService.saveWorldcup(createWorldcupDto);
  }

}
