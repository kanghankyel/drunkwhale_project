import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateDogDto {

    @ApiProperty({description:'강아지 고유번호'})
    @IsInt()
    @IsNotEmpty()
    readonly dog_idx: number;

    @ApiProperty({description:'강아지 이름'})
    @IsString()
    readonly dog_name: string | null;

    @ApiProperty({description:'강아지 성별'})
    @IsString()
    readonly dog_gender: string | null;

    @ApiProperty({description:'강아지 종'})
    @IsString()
    readonly dog_species: string | null;

    @ApiProperty({description:'강아지 크기'})
    @IsString()
    readonly dog_size: string | null;

    @ApiProperty({description:'강아지 나이'})
    @IsString()
    readonly dog_age: string | null;

    @ApiProperty({description:'강아지 성격'})
    @IsString()
    readonly dog_personality: string | null;

    @ApiProperty({description:'강아지 추가정보'})
    @IsString()
    readonly dog_info: string | null;

}
