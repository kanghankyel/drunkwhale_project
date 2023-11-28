import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { Repository } from 'typeorm';
import { Cafe } from './entities/cafe.entity';

@Injectable()
export class CafeService {

  constructor(@Inject('CAFE_REPOSITORY') private cafeRespository: Repository<Cafe>) {};

  // 카페 생성
  async createCafe(createCafeDto: CreateCafeDto): Promise<Cafe> {
    const {cafe_idx, cafe_name, cafe_info, cafe_createdate} = createCafeDto;
    const cafe = this.cafeRespository.create({
      cafe_idx,
      cafe_name,
      cafe_info,
      cafe_createdate
    });
    await this.cafeRespository.save(cafe);    // 저장하고 반환
    return cafe;
  }

  // 카페 전체 조회
  async findAllCafe(): Promise<Cafe[]> {
    return await this.cafeRespository.find();
  }

  // 카페 하나 조회
  async findOneCafe(cafe_idx: number): Promise<Cafe> {
    const cafedata = await this.cafeRespository.findOne({where:{cafe_idx}});    // 해당 데이터 검색
    if(!cafedata) {
      throw new NotFoundException(`해당 카페는 존재하지 않습니다. 입력하신 카페 : ${cafe_idx}`);    // 일치하지 않는 값 입력시 오류 반환
    }
    return await this.cafeRespository.findOne({where:{cafe_idx}});
  }

  // 카페 업데이트
  async updateCafe(cafe_idx: number, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
    const cafedata = await this.cafeRespository.findOne({where:{cafe_idx}});    // 해당 데이터 검색
    if(!cafedata) {
      throw new NotFoundException(`해당 카페는 존재하지 않습니다. 입력하신 카페 : ${cafe_idx}`);    // 일치하지 않는 값 입력시 오류 반환
    }
    await this.cafeRespository.update(cafe_idx, updateCafeDto);   // 업데이트
    return await this.cafeRespository.findOne({where:{cafe_idx}})   // 업데이트된 항목 반환
  }

  // 카페 삭제
  async removeCafe(cafe_idx: number): Promise<any> {
    try {
      const cafedata = await this.cafeRespository.findOne({where:{cafe_idx}});    // 해당 데이터 검색
      if(!cafedata) {
        return {message: `해당하는 카페가 없습니다. 입력하신 카페 : ${cafe_idx}`, error: true, statusCode: 404};    // 일치하지 않는 값 입력시 오류 반환
      }
      await this.cafeRespository.delete(cafe_idx);
      return {message: `삭제가 완료되었습니다. 삭제된 카페 : ${cafe_idx}`, deleted: true, error: false, statusCode: 200};   // 삭제 성공 여부 반환
    } catch (error) {
      return {message: '삭제에 실패하였습니다. 다시 시도해주십시오.', deleted: false, error: true, statusCode: 500};    // 삭제 실패 여부 반환
    }
  }
}
