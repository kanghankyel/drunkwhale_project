import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAlcoholDto {

    @ApiProperty({description:'주류 이미지 (원본파일명)'})
    @IsString()
    readonly alcohol_imgname: string | null;

    @ApiProperty({description:'주류 이름'})
    @IsString()
    readonly alcohol_name: string | null;

    @ApiProperty({description:'주류 이름(영문)'})
    @IsString()
    readonly alcohol_ename: string | null;

    @ApiProperty({description:'주류 타입'})
    @IsString()
    readonly alcohol_type: string | null;

    @ApiProperty({description:'주류 분류'})
    @IsString()
    readonly alcohol_class: string | null;

    @ApiProperty({description:'주류 국적'})
    @IsString()
    readonly alcohol_from: string | null;

    @ApiProperty({description:'주류 도수'})
    @IsString()
    readonly alcohol_percent: string | null;

    @ApiProperty({description:'주류 제조사'})
    @IsString()
    readonly alcohol_manufacturer: string | null;

    @ApiProperty({description:'주류 수입사'})
    @IsString()
    readonly alcohol_importer: string | null;

    @ApiProperty({description:'주류 색상'})
    @IsString()
    readonly alcohol_color: string | null;

    @ApiProperty({description:'주류 우디'})
    @IsString()
    readonly alcohol_woody: string | null;

    @ApiProperty({description:'주류 씨리얼'})
    @IsString()
    readonly alcohol_cereal: string | null;

    @ApiProperty({description:'주류 페인티'})
    @IsString()
    readonly alcohol_painty: string | null;

    @ApiProperty({description:'주류 플로럴'})
    @IsString()
    readonly alcohol_floral: string | null;

    @ApiProperty({description:'주류 와이니'})
    @IsString()
    readonly alcohol_winy: string | null;

    @ApiProperty({description:'주류 피티'})
    @IsString()
    readonly alcohol_pitty: string | null;

    @ApiProperty({description:'주류 설퍼'})
    @IsString()
    readonly alcohol_sulper: string | null;

    @ApiProperty({description:'주류 프루티'})
    @IsString()
    readonly alcohol_fruity: string | null;

    @ApiProperty({description:'주류 설명'})
    @IsString()
    readonly alcohol_info: string | null;

    // @ApiProperty({description:'회원 이메일(FK)'})
    // @IsString()
    // readonly user_email: string | null;

}
