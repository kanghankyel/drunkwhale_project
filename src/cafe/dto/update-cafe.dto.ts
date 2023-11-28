import { PartialType } from '@nestjs/mapped-types';
import { CreateCafeDto } from './create-cafe.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCafeDto extends PartialType(CreateCafeDto) {

    @IsString()
    @IsOptional()
    cafe_name?: string;

    @IsString()
    @IsOptional()
    cafe_info?: string;

}
