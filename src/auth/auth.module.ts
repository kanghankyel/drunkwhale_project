import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from './auth.config';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        UserModule,       // 유저 관련 DB 엑세스에 필요
        PassportModule,     // Passport모듈 import
        JwtModule.register({
            secret: jwtConfig.secret,       // Token을 만들 때 이용하는 비밀 값
            signOptions: {expiresIn: '60s'}     // Token 만료 시간 (* 현재 service단에서 직접 설정하였음)
        })],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtAccessStrategy],      // JwtAccessStrategy 추가
    exports: [JwtAccessStrategy, PassportModule]      // JwtAccessStrategy, PassportModule 추가
})
export class AuthModule { }
