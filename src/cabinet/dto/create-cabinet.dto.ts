import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateCabinetDto {

    @ApiProperty({description:'주류_이름(FK)'})
    @IsString()
    readonly alcohol_name: string | null;

    @ApiProperty({description:'술장고_평가(색상)'})
    @IsString()
    readonly cabinet_color: string | null;

    @ApiProperty({description:'술장고_평가(향)'})
    @IsString()
    readonly cabinet_aroma: string | null;

    @ApiProperty({description:'술장고_평가(맛)'})
    @IsString()
    readonly cabinet_flavor: string | null;

    @ApiProperty({description:'술장고_평가(개인평가)'})
    @IsString()
    readonly cabinet_review: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
