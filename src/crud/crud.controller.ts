import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrudService } from './crud.service';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRUD(test) 모듈')
@Controller('crud')
export class CrudController {

  constructor(private readonly crudService: CrudService) {}

  // Create Crud
  @Post()
  createCrud(@Body() createCrudDto: CreateCrudDto): Promise<CreateCrudDto> {
    return this.crudService.createCrud(createCrudDto);
  }

  // Find All Crud
  @Get()
  findAllCrud() {
    return this.crudService.findAllCrud();
  }

  // Find One Crud
  @Get(':crud_idx')
  findOneCrud(@Param('crud_idx') crud_idx: number) {
    return this.crudService.findOneCrud(crud_idx);
  }

  // Update Crud
  @Patch(':crud_idx')
  updateCrud(@Param('crud_idx') crud_idx: number, @Body() updateCrudDto: UpdateCrudDto) {
    return this.crudService.updateCrud(crud_idx, updateCrudDto);
  }

  // Delete Crud
  @Delete(':crud_idx')
  removeCrud(@Param('crud_idx') crud_idx: number) {
    return this.crudService.removeCrud(crud_idx);
  }
}
