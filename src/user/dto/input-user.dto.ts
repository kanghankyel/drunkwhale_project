import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class InputUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({description:'회원 전화번호'})
    @IsString()
    user_phone: string;

    @ApiProperty({description:'회원 생년월일'})
    @IsString()
    user_birth: string;

    @ApiProperty({description:'회원 성별'})
    @IsString()
    user_gender: string;

    @ApiProperty({description:'회원 우편번호'})
    @IsString()
    user_postcode: string;

    @ApiProperty({description:'회원 주소'})
    @IsString()
    user_add: string;

    @ApiProperty({description:'회원 상세주소'})
    @IsString()
    user_adddetail: string;

}