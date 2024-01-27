import { PartialType } from '@nestjs/mapped-types';
import { CreateCrudDto } from './create-crud.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCrudDto extends PartialType(CreateCrudDto) {

    @IsString()
    @IsOptional()
    crud_name?: string;

    @IsString()
    @IsOptional()
    crud_info?: string;

}
