import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAlcoholDto {

    @ApiProperty({description:'주류 이미지 (원본파일명)'})
    @IsString()
    readonly alcohol_imgname: string | null;

    @ApiProperty({description:'주류 이름'})
    @IsString()
    readonly alcohol_name: string | null;

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

    @ApiProperty({description:'주류 색상'})
    @IsString()
    readonly alcohol_color: string | null;

    @ApiProperty({description:'주류 향'})
    @IsString()
    readonly alcohol_aroma: string | null;

    @ApiProperty({description:'주류 맛'})
    @IsString()
    readonly alcohol_flavor: string | null;

    @ApiProperty({description:'주류 설명'})
    @IsString()
    readonly alcohol_info: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
