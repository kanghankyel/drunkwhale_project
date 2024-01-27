import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@ApiTags('Admin 모듈')
@Controller()
export class AdminController {

  constructor(private readonly adminService: AdminService) {};

  private logger = new Logger('admin.controller.ts');

  // 가맹회원+가맹스토어 신청 허가
  @ApiOperation({summary:'가맹회원+가맹스토어 신청 허가', description:'가맹회원+가맹스토어 신청 허가'})
  @ApiBearerAuth()
  @Patch('api/admin/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ROLE_ADMIN)
  async approveOwnerStore(@Body() body: {user_email: string}) {
    return this.adminService.approveOwnerStore(body.user_email);
  }

}
