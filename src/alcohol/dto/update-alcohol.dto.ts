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

    @ApiProperty({description:'주류 이름(영문)'})
    @IsString()
    @IsOptional()
    readonly alcohol_ename?: string | null;

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

    @ApiProperty({description:'주류 제조사'})
    @IsString()
    @IsOptional()
    readonly alcohol_manufacturer?: string | null;

    @ApiProperty({description:'주류 수입사'})
    @IsString()
    @IsOptional()
    readonly alcohol_importer?: string | null;

    @ApiProperty({description:'주류 색상'})
    @IsString()
    @IsOptional()
    readonly alcohol_color?: string | null;

    @ApiProperty({description:'주류 우디'})
    @IsString()
    @IsOptional()
    readonly alcohol_woody?: string | null;

    @ApiProperty({description:'주류 씨리얼'})
    @IsString()
    @IsOptional()
    readonly alcohol_cereal?: string | null;

    @ApiProperty({description:'주류 페인티'})
    @IsString()
    @IsOptional()
    readonly alcohol_painty?: string | null;

    @ApiProperty({description:'주류 플로럴'})
    @IsString()
    @IsOptional()
    readonly alcohol_floral?: string | null;

    @ApiProperty({description:'주류 와이니'})
    @IsString()
    @IsOptional()
    readonly alcohol_winy?: string | null;

    @ApiProperty({description:'주류 피티'})
    @IsString()
    @IsOptional()
    readonly alcohol_pitty?: string | null;

    @ApiProperty({description:'주류 설퍼'})
    @IsString()
    @IsOptional()
    readonly alcohol_sulper?: string | null;

    @ApiProperty({description:'주류 프루티'})
    @IsString()
    @IsOptional()
    readonly alcohol_fruity?: string | null;

    @ApiProperty({description:'주류 설명'})
    @IsString()
    @IsOptional()
    readonly alcohol_info?: string | null;

    // @ApiProperty({description:'회원 이메일(FK)'})
    // @IsString()
    // @IsOptional()
    // readonly user_email?: string | null;

}