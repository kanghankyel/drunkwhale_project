import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationStoreDto {

    @ApiProperty({description:'페이지번호', required: false})
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number = 10;

    @ApiProperty({description:'정렬기준 ( A=이름오름차순, B=이름내림차순 )', required: false})
    @IsOptional()
    @IsString()
    sort?: string;

}