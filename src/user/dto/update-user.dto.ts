import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일'})
    @IsString()
    @IsOptional()
    readonly user_email?: string | null;

    @ApiProperty({example:'test4321@test.com', description:'회원 새로운 이메일'})
    @IsString()
    @IsOptional()
    readonly user_newemail?: string | null;

    @ApiProperty({example:'test1234', description:'회원 비밀번호'})
    @IsString()
    @IsOptional()
    readonly user_pw?: string | null;

    @ApiProperty({example:'수정된닉네임', description:'회원 닉네임'})
    @IsString()
    @IsOptional()
    readonly user_nickname?: string | null;

    @ApiProperty({example:'수정된전화번호', description:'회원 전화번호'})
    @IsString()
    @IsOptional()
    readonly user_phone?: string | null;

    @ApiProperty({example:'654321', description:'회원 우편번호'})
    @IsString()
    @IsOptional()
    readonly user_postcode?: string | null;

    @ApiProperty({example:'수정된주소', description:'회원 주소'})
    @IsString()
    @IsOptional()
    readonly user_add?: string | null;

    @ApiProperty({example:'수정된상세주소', description:'회원 상세주소'})
    @IsString()
    @IsOptional()
    readonly user_adddetail?: string | null;

}
