import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Menu 모듈')
@Controller()
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  private logger = new Logger('menu.controller.ts');

  // 메뉴 상품등록
  @ApiOperation({summary:'메뉴 상품등록', description:'메뉴 상품등록'})
  @ApiBearerAuth()
  @Post('api/create/menu')
  @UseInterceptors(FileInterceptor('menu_image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async createMenu(@Body() createMenuDto: CreateMenuDto, @UploadedFile() file) {
    return this.menuService.createMenu(createMenuDto, file);
  }

}
