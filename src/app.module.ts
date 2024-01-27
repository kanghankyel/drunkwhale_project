import { MiddlewareConsumer, Module, NestModule, Options } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { DogModule } from './dog/dog.module';
import { StoreModule } from './store/store.module';
import { AdminModule } from './admin/admin.module';
import { CrudModule } from './crud/crud.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, RoleModule, DogModule, StoreModule, AdminModule, CrudModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//       consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
