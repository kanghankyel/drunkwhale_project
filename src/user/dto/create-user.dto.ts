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

    @ApiProperty({description:'회원 정보'})
    @IsString()
    readonly user_info: string | null;

    @ApiProperty({description:'회원 생성일'})
    @IsString()
    readonly user_createdate: string;

}