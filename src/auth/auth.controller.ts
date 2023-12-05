import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('로그인')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    private logger = new Logger('auth.controller.ts');

    // 로그인
    @Post('login')
    async loginUser(@Body() loginAuthDto: LoginAuthDto, @Res() res) {
        this.logger.log('클라이언트에서 전달 된 값 : ', loginAuthDto);
        const loginAuth: {message: string, data: string, statusCode: number} = await this.authService.loginUser(loginAuthDto);
        if (loginAuth.statusCode === 200) {     // 로그인 성공시 RefreshToken도 함께 발급
            this.authService.setRefreshToken(loginAuthDto, res);
        }
        return res.status(HttpStatus.OK).json(loginAuth);       // res.status()를 호출해서 200에 대한 내용 전달 + service단에서 만든 데이터를 JSON 형태도 전달
    }

    // 토큰 재발급
    @Post('refresh')
    @UseGuards(AuthGuard('refresh'))
    async refresh(@Req() req, @Res({passthrough: true}) res) {
        try {
            const user = req.user;
            const accessToken = await this.authService.getAccessToken(user);
            const refreshToken = this.authService.setRefreshToken(user, res);
            res.cookie('refreshToken', refreshToken, {httpOnly: true});
            this.logger.debug(`RefreshToken 발급 성공 - 사용자 : ${user.user_id}`);
            return {accessToken};
        } catch (error) {
            this.logger.error(`RefreshToken 발급 중 오류 : ${error.message}`);
            return {error: 'RefreshToken 발급 중 오류가 발생했습니다.'};
        }
    }


    @Post('test')
    @UseGuards(JwtAuthGuard)
    test(@Req() req, @Res() res) {
        // console.log('요청값 확인 : ', req);
        if(req.user) {
            this.logger.log('회원 정보 : ' + req.user);
            return res.json({user: req.user});
        }
        return res.json({});
    }


}
