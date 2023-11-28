import { Module, Options } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CafeModule } from './cafe/cafe.module';

@Module({
  imports: [DatabaseModule, UserModule, CafeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
