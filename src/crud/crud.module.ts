import { Module } from '@nestjs/common';
import { CrudService } from './crud.service';
import { CrudController } from './crud.controller';
import { DatabaseModule } from 'src/database/database.module';
import { crudRepository } from './crud.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CrudController],
  providers: [...crudRepository, CrudService],
})
export class CrudModule {}
