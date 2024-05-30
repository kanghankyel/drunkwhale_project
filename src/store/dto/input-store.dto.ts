import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreDto } from "./create-store.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InputStoreDto {

    @ApiProperty({description:'스토어 대표이미지'})
    @IsString()
    readonly store_mainimg: string | null;

    @ApiProperty({description:'스토어 서브이미지'})
    readonly store_subimg: string[] | null;

    @ApiProperty({description:'스토어 개장시간'})
    @IsString()
    readonly store_opentime: string | null;

    @ApiProperty({description:'스토어 폐장시간'})
    @IsString()
    readonly store_closetime: string | null;

    @ApiProperty({description:'스토어 휴무일정'})
    @IsString()
    readonly store_offday: string | null;

    @ApiProperty({description:'스토어 소개정보'})
    @IsString()
    readonly store_info: string | null;

    @ApiProperty({description:'스토어 키워드'})
    @IsString()
    readonly stroe_keyword: string | null;

    @ApiProperty({description:'스토어 회원이메일'})
    @IsString()
    readonly user_email: string | null;

}