import { MiddlewareConsumer, Module, NestModule, Options } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CafeModule } from './cafe/cafe.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { DogModule } from './dog/dog.module';
import { StoreModule } from './store/store.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DatabaseModule, UserModule, CafeModule, AuthModule, RoleModule, DogModule, StoreModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//       consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
