import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCabinetDto {

    @ApiProperty({example:'1', description:'술장고 고유번호'})
    @IsString()
    readonly cabinet_idx: number;

    @ApiProperty({example:'색상', description:'술장고_평가(색상)'})
    @IsString()
    @IsOptional()
    readonly cabinet_color?: string | null;

    @ApiProperty({example:'향', description:'술장고_평가(향)'})
    @IsString()
    @IsOptional()
    readonly cabinet_aroma?: string | null;

    @ApiProperty({example:'맛', description:'술장고_평가(맛)'})
    @IsString()
    @IsOptional()
    readonly cabinet_flavor?: string | null;

    @ApiProperty({example:'술장고평가 텍스트', description:'술장고_평가(개인평가)'})
    @IsString()
    @IsOptional()
    readonly cabinet_review?: string | null;

}