import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RoleModule } from 'src/role/role.module';
import { adminRepository } from './admin.repository';
import { RoleService } from 'src/role/role.service';
import { StoreService } from 'src/store/store.service';
import { StoreModule } from 'src/store/store.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, StoreModule, RoleModule],
  controllers: [AdminController],
  providers: [...adminRepository, AdminService, RoleService, StoreService],
})
export class AdminModule {}
