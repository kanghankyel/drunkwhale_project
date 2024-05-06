import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCabinetDto {

    @ApiProperty({example:'1', description:'술장고 고유번호'})
    @IsString()
    readonly cabinet_idx: number;

    @ApiProperty({example:'2', description:'술장고_평가(색상)'})
    @IsString()
    @IsOptional()
    readonly cabinet_color?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(우디)'})
    @IsString()
    @IsOptional()
    readonly cabinet_woody?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(씨리얼)'})
    @IsString()
    @IsOptional()
    readonly cabinet_cereal?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(페인티)'})
    @IsString()
    @IsOptional()
    readonly cabinet_painty?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(플로럴)'})
    @IsString()
    @IsOptional()
    readonly cabinet_floral?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(와이니)'})
    @IsString()
    @IsOptional()
    readonly cabinet_winy?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(피티)'})
    @IsString()
    @IsOptional()
    readonly cabinet_pitty?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(설퍼)'})
    @IsString()
    @IsOptional()
    readonly cabinet_sulper?: string | null;

    @ApiProperty({example:'2', description:'술장고_평가(프루티)'})
    @IsString()
    @IsOptional()
    readonly cabinet_fruity?: string | null;

    @ApiProperty({example:'술장고평가 텍스트', description:'술장고_평가(개인평가)'})
    @IsString()
    @IsOptional()
    readonly cabinet_review?: string | null;

}