import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from './auth.config';

@Module({
    imports: [UserModule,
        PassportModule,     // Passport모듈 import
        JwtModule.register({
            secret: jwtConfig.secret,       // Token을 만들 때 이용하는 비밀 값
            signOptions: {expiresIn: '60s'}     // Token 만료 시간
        })],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }