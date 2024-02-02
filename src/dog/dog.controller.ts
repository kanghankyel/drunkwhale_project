import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@ApiTags('Dog 모듈')
@Controller()
export class DogController {

  constructor(private readonly dogService: DogService) {}

  private logger = new Logger('dog.controller.ts');

  // 회원 반려동물 정보입력
  @ApiOperation({summary:'반려견 정보입력', description:'반려견 정보입력'})
  @ApiBearerAuth()
  @Post('api/create/dog')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async createDog(@Body() createDogDto: CreateDogDto) {
    return this.dogService.createDog(createDogDto);
  }

  // 회원 반려동물 정보보기(개인)
  @ApiOperation({summary:'반려동물 정보보기(개인)', description:'반려동물 정보보기(개인)'})
  @ApiBearerAuth()
  @Get('api/mydog')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ROLE_USER)
  async myPets(@Body('user_email') user_email: string) {
    return this.dogService.getMyPets(user_email);
  }

}
