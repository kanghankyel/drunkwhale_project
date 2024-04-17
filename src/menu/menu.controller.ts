import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('Menu 모듈')
@Controller()
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  private logger = new Logger('menu.controller.ts');

  // 메뉴 상품등록
  @ApiOperation({summary:'메뉴 상품등록', description:'메뉴 상품등록'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        menu_image: {type: 'string', format: 'binary'},
        menu_name: {type: 'string'},
        menu_type: {type: 'string'},
        menu_info: {type: 'string'},
        menu_price: {type: 'string'},
        user_email: {type: 'string'},
      },
    }
  })
  @ApiBearerAuth()
  @Post('api/create/menu')
  @UseInterceptors(FileInterceptor('menu_image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async createMenu(@Body() createMenuDto: CreateMenuDto, @UploadedFile() file) {
    return this.menuService.createMenu(createMenuDto, file);
  }

  // 메뉴 상품수정
  @ApiOperation({summary:'메뉴 상품수정', description:'메뉴 상품수정'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        menu_idx: {type: 'number'},
        menu_image: {type: 'string', format: 'binary'},
        menu_name: {type: 'string'},
        menu_type: {type: 'string'},
        menu_info: {type: 'string'},
        menu_price: {type: 'string'},
        user_email: {type: 'string'},
      },
    }
  })
  @ApiBearerAuth()
  @Patch('api/update/menu')
  @UseInterceptors(FileInterceptor('menu_image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto, @UploadedFile() file) {
    return this.menuService.updateMenu(updateMenuDto, file);
  }

  // 등록된 메뉴 삭제
  @ApiOperation({summary:'메뉴 삭제', description:'메뉴 삭제'})
  @ApiBearerAuth()
  @Delete('api/delete/menu')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_OWNER)
  async deleteMenu(@Body() {menu_idx}) {
    return this.menuService.deleteMenu(menu_idx);
  }

}
