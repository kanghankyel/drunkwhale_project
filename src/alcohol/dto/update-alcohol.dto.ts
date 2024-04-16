import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateAlcoholDto {

    @ApiProperty({description:'주류 고유번호'})
    @IsString()
    readonly alcohol_idx: number;

    @ApiProperty({description:'주류 이미지 (원본파일명)'})
    @IsString()
    @IsOptional()
    readonly alcohol_imgname?: string | null;

    @ApiProperty({description:'주류 이름'})
    @IsString()
    @IsOptional()
    readonly alcohol_name?: string | null;

    @ApiProperty({description:'주류 타입'})
    @IsString()
    @IsOptional()
    readonly alcohol_type?: string | null;

    @ApiProperty({description:'주류 분류'})
    @IsString()
    @IsOptional()
    readonly alcohol_class?: string | null;

    @ApiProperty({description:'주류 국적'})
    @IsString()
    @IsOptional()
    readonly alcohol_from?: string | null;

    @ApiProperty({description:'주류 도수'})
    @IsString()
    @IsOptional()
    readonly alcohol_percent?: string | null;

    @ApiProperty({description:'주류 색상'})
    @IsString()
    @IsOptional()
    readonly alcohol_color?: string | null;

    @ApiProperty({description:'주류 향'})
    @IsString()
    @IsOptional()
    readonly alcohol_aroma?: string | null;

    @ApiProperty({description:'주류 맛'})
    @IsString()
    @IsOptional()
    readonly alcohol_flavor?: string | null;

    @ApiProperty({description:'주류 설명'})
    @IsString()
    @IsOptional()
    readonly alcohol_info?: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    @IsOptional()
    readonly user_email?: string | null;

}