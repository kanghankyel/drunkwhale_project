import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationAlcoholDto {
    
    @ApiProperty({description:'페이지번호', required: false})
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number = 10;

    @ApiProperty({description:'정렬기준 (A=최신등록순, B=과거등록순, C=이름오름차순, D=이름내림차순, E=도수높은순, F=도수낮은순)', required: false})
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiProperty({description:'주류분류 검색기준 (싱글 몰트 위스키, 블렌디드 몰트 위스키, 그레인 위스키, 블렌디드 위스키, 아이리쉬 위스키, 버번 위스키, 콘 위스키, 라이 위스키, 테네시 위스키, 기타)', required: false})
    @IsOptional()
    @IsString()
    readonly sortclass?: string;

}