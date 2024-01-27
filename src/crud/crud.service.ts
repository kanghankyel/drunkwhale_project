import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { Repository } from 'typeorm';
import { Crud } from './entities/crud.entity';

@Injectable()
export class CrudService {

  constructor(@Inject('CRUD_REPOSITORY') private crudRespository: Repository<Crud>) {};

  // CRUD 생성
  async createCrud(createCrudDto: CreateCrudDto): Promise<Crud> {
    const {crud_idx, crud_name, crud_info, crud_createdate} = createCrudDto;
    const crud = this.crudRespository.create({
      crud_idx,
      crud_name,
      crud_info,
      crud_createdate
    });
    await this.crudRespository.save(crud);    // 저장하고 반환
    return crud;
  }

  // CRUD 전체 조회
  async findAllCrud(): Promise<Crud[]> {
    return await this.crudRespository.find();
  }

  // CRUD 하나 조회
  async findOneCrud(crud_idx: number): Promise<Crud> {
    const cruddata = await this.crudRespository.findOne({where:{crud_idx}});    // 해당 데이터 검색
    if(!cruddata) {
      throw new NotFoundException(`해당 CRUD는 존재하지 않습니다. 입력하신 CRUD : ${crud_idx}`);    // 일치하지 않는 값 입력시 오류 반환
    }
    return await this.crudRespository.findOne({where:{crud_idx}});
  }

  // CRUD 업데이트
  async updateCrud(crud_idx: number, updateCrudDto: UpdateCrudDto): Promise<Crud> {
    const cruddata = await this.crudRespository.findOne({where:{crud_idx}});    // 해당 데이터 검색
    if(!cruddata) {
      throw new NotFoundException(`해당 CRUD는 존재하지 않습니다. 입력하신 CRUD : ${crud_idx}`);    // 일치하지 않는 값 입력시 오류 반환
    }
    await this.crudRespository.update(crud_idx, updateCrudDto);   // 업데이트
    return await this.crudRespository.findOne({where:{crud_idx}})   // 업데이트된 항목 반환
  }

  // CRUD 삭제
  async removeCrud(crud_idx: number): Promise<any> {
    try {
      const cruddata = await this.crudRespository.findOne({where:{crud_idx}});    // 해당 데이터 검색
      if(!cruddata) {
        return {message: `해당하는 CRUD가 없습니다. 입력하신 CRUD : ${crud_idx}`, error: true, statusCode: 404};    // 일치하지 않는 값 입력시 오류 반환
      }
      await this.crudRespository.delete(crud_idx);
      return {message: `삭제가 완료되었습니다. 삭제된 CRUD : ${crud_idx}`, deleted: true, error: false, statusCode: 200};   // 삭제 성공 여부 반환
    } catch (error) {
      return {message: '삭제에 실패하였습니다. 다시 시도해주십시오.', deleted: false, error: true, statusCode: 500};    // 삭제 실패 여부 반환
    }
  }
}
