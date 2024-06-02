<img src="https://capsule-render.vercel.app/api?type=waving&color=0:B993D6,100:8CA6DB&height=200&section=header&text=Drunken%20Whale&fontColor=f7f5f5&fontSize=55&fontAlign=71&fontAlignY=40&desc=Backend.%20madeBy%20강한결&descSize=18&descAlign=78" />

<p align="center">
  <a href="http://118.67.133.203/" target="blank"><img src="https://github.com/kanghankyel/drunkwhale_project/assets/100983731/7cc09b02-d042-48af-9995-aa1c07ade136" width="150" alt="drunkwhale_logo" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="http://118.67.133.203:3001/swagger" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" width="150" alt="Swagger Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">위 이미지 혹은 <a href="http://118.67.133.203/" target="_blank">Homepage(제작중입니다)</a> / <a href="http://118.67.133.203:3001/swagger" target="_blank">Swagger</a> 클릭을 통해 제작된 프로젝트로 확인하실 수 있습니다.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<!--<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>-->
<!--   <a href="" target="_blank"></a> -->
  <a href="" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/Node-%23333333?logo=ts-node"></a>
  <a href="" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/NestJS-%23E0234E?logo=nestjs"></a>
  <a href="" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/Git-white?logo=git"></a>
  <a href="" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/Github-red?logo=github"></a>
  <a href="" target="_blank"><img src="https://img.shields.io/badge/Swagger-222222?style=flat-square&logo=Swagger"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 설명

> 수많은 주류정보를 기반으로 다양하고, 창의적인 기능들을 구현해 보고자 하는 것을 목표로 제작되고 있는 멀티플랫폼 애플리케이션 <a href="http://118.67.133.203:3001/swagger" target="_blank">"드렁큰고래(DrunkWhale)"</a> 프로젝트입니다.
> 
> 본 프로젝트는 전체 프로젝트 중 Backend 부분으로, Node.js와 TypeScript기반의 NestJS 프레임워크로 제작되었습니다.

## 주요 기능
> 회원가입
>> 회원가입 / 로그인&간편로그인
>> - 일반회원과 가맹회원을 별도로 구성하여 권한관리에 따른 기능 차별성을 추구하여 구성.
>> - JWT 로그인 형태로 구현하고, 인증인가&보안 라이브러리 사용으로 서버의 안전성과 확장성 용이.
>> - 간편로그인(카카오 & 구글) 구현을 통해 사용자 편의성 증대.
>> 
> 주류 모듈
>> - 주 소재인 다양한 주류를 등록하고, 시각화, 분류화하여 정보 관리를 용이하게 구성.
>> - 등록된 주류를 기반으로 개인의 테이스팅노트를 작성할 수 있게 하여, 주류정보를 더욱 수치화.
>> - 개인이 좋아하는 주류를 저장할 수 있게 하고, 그에 따라 산출된 결과물을 취합하여 아래에 기술될 '주류월드컵'에 사용하게 됨.
>> 
> 주류월드컵
>> - 이상형월드컵에서 착안하여 제작된 기능으로, 주류객체들 중 인기제품을 선별하는 로직을 구성하여 데이터를 취합.
>> - 취합된 데이터를 통해 선별된 주류월드컵 결과를 서버에 제공받아 아래 기술될 '술친구'로직에 사용하게 됨.
>> 
> 술친구
>> - 주류월드컵에서 취합된 정보를 기반으로 회원이 술친구 요청을 보낼 수 있게 하는 로직을 구성함.
>> - 같은 지역구 기반으로 1차 취합, 유사한 주류월드컵 결과를 추출하여 2차 취합하여 술친구 추천 로직 생성.
>> - 추천된 술친구에게 매칭요청 메일을 전송할 수 있게하고, 매칭요청을 받은 회원은 답장과 수락/거절 데이터를 전송할 수 있게 구성.
>>
> 스토어
>> - 가맹회원가입시 선 정보(필수정보)를 등록하고, 가맹회원승인이 되면 후 정보(부가정보)를 통해 매장을 개설할 수 있게 구성.
>> - 메뉴항목 개설을 통해 스토어 홍보를 용이하게 구성. 메뉴를 카테고리화하여 더 나은 형태로 시각화 정보 제공.
>> 
> Etc.
>> - RESTful 아키텍처 설계방식을 통해 클라이언트와 서버 상호간의 유연성을 추구.
>> - SFTP를 통한 파일데이터 전송 로직을 사용해 서버의 효율성을 추구함.
>> = ORM 사용을 통해 코드 재사용성과 데이터베이스 독립성을 유지.
>> - 무중단 배포를 위해 PM2 프로세스 매니저를 사용.
>>
> ERD 구성
>> ![drunkenwhale_erd](https://github.com/kanghankyel/drunkwhale_project/assets/100983731/e23143ac-2dd7-44f2-975b-1bebf068bcac)

## 설치 방법

```bash
$ npm install
```

## 실행 방법

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->

## 제작

> Backend
>> 강한결 ( KangHanKyel )
>>
>> ![Static Badge](https://img.shields.io/badge/Gmail-gksruf3874%40gmaill.com-red?logo=Gmail) &nbsp;
>> [![Static Badge](https://img.shields.io/badge/Git-github.com%2Fkanghankyel-blue?logo=GitHub&link=https%3A%2F%2Fgithub.com%2Fkanghankyel)](https://github.com/kanghankyel)

> Frontend
>> 조소현 ( ChoSoHyeon )

> Planning
>> 한지헌 ( HanJiHeon )

## 사용된 주요 기술

<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="" /> &nbsp; <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="" /> &nbsp; <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="" /> &nbsp; <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="" />

![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=kanghankyel&layout=compact&exclude_repo=KP)

## License

Nest is [MIT licensed](LICENSE).
