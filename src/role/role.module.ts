import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesGuard } from './role.guard';
import { roleRepository } from './role.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...roleRepository, RoleService, RolesGuard],
  exports: [...roleRepository, RoleService, RolesGuard]
})
export class RoleModule {}
