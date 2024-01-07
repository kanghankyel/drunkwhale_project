import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@ApiTags('Dog 모듈')
@Controller('dog')
export class DogController {

  constructor(private readonly dogService: DogService) {}

  private logger = new Logger('dog.controller.ts');

  @ApiOperation({summary:'애완견 정보입력', description:'애완견 정보입력'})
  @ApiBearerAuth()
  @Post('/createdog/:user_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_USER)
  async createDog(@Param('user_id') user_id: string, @Body() createDogDto: CreateDogDto) {
    return this.dogService.createDog(user_id, createDogDto);
  }

}
