import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateCabinetDto {

    @ApiProperty({example:'주류고유번호', description:'주류_고유번호(FK)'})
    @IsString()
    readonly alcohol_idx: number | null;

    @ApiProperty({example:'3', description:'술장고_평가(색상)'})
    @IsString()
    readonly cabinet_color: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(우디)'})
    @IsString()
    readonly cabinet_woody: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(씨리얼)'})
    @IsString()
    readonly cabinet_cereal: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(페인티)'})
    @IsString()
    readonly cabinet_painty: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(플로럴)'})
    @IsString()
    readonly cabinet_floral: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(와이니)'})
    @IsString()
    readonly cabinet_winy: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(피티)'})
    @IsString()
    readonly cabinet_pitty: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(설퍼)'})
    @IsString()
    readonly cabinet_sulper: string | null;

    @ApiProperty({example:'3', description:'술장고_평가(프루티)'})
    @IsString()
    readonly cabinet_fruity: string | null;

    @ApiProperty({example:'술장고평가 텍스트', description:'술장고_평가(개인평가)'})
    @IsString()
    readonly cabinet_review: string | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
