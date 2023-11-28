import { IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCafeDto {

    @IsInt()
    @IsNotEmpty()
    readonly cafe_idx: number;

    @IsString()
    @IsNotEmpty()
    readonly cafe_name: string;

    @IsString()
    readonly cafe_info: string;

    @IsString()
    readonly cafe_createdate: string;

}
