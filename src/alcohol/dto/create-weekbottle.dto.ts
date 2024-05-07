import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateWeekbottleDto {

    @ApiProperty({example:'5', description:'주류 코드'})
    @IsInt()
    readonly alcohol_idx: number | null;

}