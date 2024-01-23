import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateOwnerDto {

    @ApiProperty({description:'가맹주 이메일'})
    @IsString()
    readonly user_email: string | null;

    @ApiProperty({description:'가맹주 비밀번호'})
    @IsString()
    readonly user_pw: string | null;

    @ApiProperty({description:'가맹주 이름'})
    @IsString()
    readonly user_name: string | null;

    @ApiProperty({description:'가맹주 닉네임'})
    @IsString()
    readonly user_nickname: string | null;

    @ApiProperty({description:'가맹주 개인전화번호'})
    @IsString()
    readonly user_phone: string | null;

    @ApiProperty({description:'가맹주 아이피'})
    @IsString()
    readonly user_ip: string | null;

    @ApiProperty({description:'가맹주 상태 ( A=일반회원활동중, B=일반회원블락, C=일반회원탈퇴, Z=가맹회원활동중, Y=가맹회원블락, X=가맹회원탈퇴, W=가맹회원신청대기중 )'})
    @IsString()
    readonly user_status: string | null;

    @ApiProperty({description:'가맹주 권한'})
    @IsString({each: true})
    readonly roles: string[] | null;

}