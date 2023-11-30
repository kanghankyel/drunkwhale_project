import { Module, Options } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CafeModule } from './cafe/cafe.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, CafeModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
