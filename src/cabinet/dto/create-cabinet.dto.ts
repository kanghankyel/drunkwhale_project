import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateCabinetDto {

    @ApiProperty({example:'주류이름', description:'주류_이름(FK)'})
    @IsString()
    readonly alcohol_name: string | null;

    @ApiProperty({example:'색상', description:'술장고_평가(색상)'})
    @IsString()
    readonly cabinet_color: string | null;

    @ApiProperty({example:'향', description:'술장고_평가(향)'})
    @IsString()
    readonly cabinet_aroma: string | null;

    @ApiProperty({example:'맛', description:'술장고_평가(맛)'})
    @IsString()
    readonly cabinet_flavor: string | null;

    @ApiProperty({example:'술장고평가 텍스트', description:'술장고_평가(개인평가)'})
    @IsString()
    readonly cabinet_review: string | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
