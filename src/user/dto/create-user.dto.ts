import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    @ApiProperty({description:'회원 고유번호'})
    @IsInt()
    @IsNotEmpty()
    readonly user_idx: number;

    @ApiProperty({description:'회원 아이디'})
    @IsString()
    readonly user_id: string | null;

    @ApiProperty({description:'회원 비밀번호'})
    @IsString()
    readonly user_pw: string | null;

    @ApiProperty({description:'회원 이름'})
    @IsString()
    readonly user_name: string | null;

    @ApiProperty({description:'회원 전화번호'})
    @IsString()
    readonly user_phone: string | null;

    @ApiProperty({description:'회원 이메일'})
    @IsString()
    readonly user_email: string | null;

    @ApiProperty({description:'회원 생년월일'})
    @IsString()
    readonly user_birth: string | null;

    @ApiProperty({description:'회원 성별'})
    @IsString()
    readonly user_gender: string | null;

    @ApiProperty({description:'회원 아이피'})
    @IsString()
    readonly user_ip: string | null;

    @ApiProperty({description:'회원 우편번호'})
    @IsString()
    readonly user_postcode: string | null;

    @ApiProperty({description:'회원 주소'})
    @IsString()
    readonly user_add: string | null;

    @ApiProperty({description:'회원 상세주소'})
    @IsString()
    readonly user_adddetail: string | null;

    @ApiProperty({description:'회원 상태'})
    @IsString()
    readonly user_status: string | null;

    @ApiProperty({description:'회원 생성일'})
    @IsString()
    readonly user_createdate: string;

    @ApiProperty({description:'회원 수정일'})
    @IsString()
    readonly user_updatedate: string | null;

    @ApiProperty({description:'회원 탈퇴일'})
    @IsString()
    readonly user_deletedate: string | null;

    @IsString({each: true})
    readonly roles: string[] | null;

}