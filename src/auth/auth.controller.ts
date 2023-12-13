import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@ApiTags('AUTH 모듈')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private userService: UserService) {}

    private logger = new Logger('auth.controller.ts');

    // 일반 로그인
    @ApiOperation({summary:'로그인', description:'로그인'})
    @Post('login')
    async loginUser(@Body() loginAuthDto: LoginAuthDto, @Res() res) {
        this.logger.log(`클라이언트에서 전달 된 값 (아이디만) : ${loginAuthDto.user_id}`);
        const loginAuth: {message: string, data: string, statusCode: number} = await this.authService.loginUser(loginAuthDto);
        if (loginAuth.statusCode === 200) {     // 로그인 성공시 RefreshToken도 함께 발급
            this.authService.setRefreshToken(loginAuthDto, res);
        }
        return res.status(HttpStatus.OK).json(loginAuth);       // res.status()를 호출해서 200에 대한 내용 전달 + service단에서 만든 데이터를 JSON 형태도 전달
    }

    // 토큰 재발급
    @ApiOperation({summary:'토큰재발급', description:'토큰재발급'})
    @ApiBearerAuth()
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

    // 로그아웃
    @ApiOperation({summary:'로그아웃', description:'토큰삭제. 로그아웃'})
    @Post('logout')
    @UseGuards(AuthGuard('refresh'))
    logout(@Req() req, @Res() res) {
        this.logger.log(`${req.user.user_id} 가 로그아웃 되었습니다.`);
        res.clearCookie('refreshToken'); // 쿠키 삭제
        return res.send({result: '로그아웃완료'});
    }

    // OAuth 소셜로그인(구글) 입력창
    @ApiOperation({summary:'소셜로그인(구글)', description:'소셜로그인(구글)'})
    @Get('login/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req, @Res() res) {
        res.redirect('http://localhost:3000/auth/login/google/redirect');
    }

    // OAuth 소셜로그인 & 회원가입
    @ApiOperation({summary:'소셜로그인 리다이렉트', description:'소셜로그인 리다이렉트'})
    @Get('login/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req, @Res() res) {
        const user = await this.authService.oAuthLogin(req.user);
        const token = this.authService.setOAuthRefreshToken(user, res);
        this.logger.log(`소셜로그인 정보 :  ${user.user_email}`);
        res.redirect('http://localhost:3000/');
    }



}
