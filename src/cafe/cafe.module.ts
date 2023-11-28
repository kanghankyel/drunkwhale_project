import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { DatabaseModule } from 'src/database/database.module';
import { cafeRepository } from './cafe.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CafeController],
  providers: [...cafeRepository, CafeService],
})
export class CafeModule {}
