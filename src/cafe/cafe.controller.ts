import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

@Controller('cafe')
export class CafeController {

  constructor(private readonly cafeService: CafeService) {}

  // Create Cafe
  @Post()
  createCafe(@Body() createCafeDto: CreateCafeDto): Promise<CreateCafeDto> {
    return this.cafeService.createCafe(createCafeDto);
  }

  // Find All Cafe
  @Get()
  findAllCafe() {
    return this.cafeService.findAllCafe();
  }

  // Find One Cafe
  @Get(':cafe_idx')
  findOneCafe(@Param('cafe_idx') cafe_idx: number) {
    return this.cafeService.findOneCafe(cafe_idx);
  }

  // Update Cafe
  @Patch(':cafe_idx')
  updateCafe(@Param('cafe_idx') cafe_idx: number, @Body() updateCafeDto: UpdateCafeDto) {
    return this.cafeService.updateCafe(cafe_idx, updateCafeDto);
  }

  // Delete Cafe
  @Delete(':cafe_idx')
  removeCafe(@Param('cafe_idx') cafe_idx: number) {
    return this.cafeService.removeCafe(cafe_idx);
  }
}
