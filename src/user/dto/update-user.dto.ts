import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({description:'회원 아이디'})
    @IsString()
    @IsOptional()
    user_id?: string;

    @ApiProperty({description:'회원 비밀번호'})
    @IsString()
    @IsOptional()
    user_pw?: string;

    @ApiProperty({description:'회원 이름'})
    @IsString()
    @IsOptional()
    user_name?: string;

    @ApiProperty({description:'회원 전화번호'})
    @IsString()
    @IsOptional()
    user_phone?: string;

    @ApiProperty({description:'회원 이메일'})
    @IsString()
    @IsOptional()
    user_email?: string;

    @ApiProperty({description:'회원 정보'})
    @IsString()
    @IsOptional()
    user_info?: string;

}
