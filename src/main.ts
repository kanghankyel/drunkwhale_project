import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('드렁큰 고래')
    .setDescription('GBSB 합동 프로젝트 ver01')
    .setVersion('1.0')
    .addBearerAuth()    // swagger에서 Bearer토큰 입력창 사용할 수 있게 함.
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // cookie-parser 설정
  app.use(cookieParser());

  // Passport 초기화 추가
  app.use(passport.initialize());

  // CORS 활성화
  app.enableCors({
    // origin: 'http://localhost:3000',
    credentials: true,
  });

  // 정적 파일 제공을 위해 Express 앱 생성
  const expressApp = express();

  // 정적 파일 미들웨어 추가
  expressApp.use('/uploads', express.static('/root/uploads'));

  // NestJS 앱을 Express 앱에 마운트
  app.use(expressApp);

  await app.listen(3001);
}
bootstrap();
