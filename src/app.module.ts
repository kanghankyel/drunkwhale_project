import { MiddlewareConsumer, Module, NestModule, Options } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { AlcoholModule } from './alcohol/alcohol.module';
import { StoreModule } from './store/store.module';
import { AdminModule } from './admin/admin.module';
import { MenuModule } from './menu/menu.module';
import { SftpModule } from './sftp/sftp.module';
import { MulterModule } from '@nestjs/platform-express';
import { CabinetModule } from './cabinet/cabinet.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { WorldcupModule } from './worldcup/worldcup.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    RoleModule,
    AlcoholModule,
    StoreModule,
    AdminModule,
    MenuModule,
    SftpModule,
    MulterModule.register({dest:'./uploads'}),
    CabinetModule,
    SubscribeModule,
    WorldcupModule,
    FriendModule,    // 업로드된 파일이 저장될 경로 (정적 구성)
    // MulterModule.registerAsync({useFactory: () => ({dest:'./uploads'})}),    // 업로드된 파일이 저장될 경로 (비동기 구성)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//       consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
