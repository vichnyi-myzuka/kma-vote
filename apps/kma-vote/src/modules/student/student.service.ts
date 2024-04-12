import { Injectable } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStudent } from '@libs/core/database/entities';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(BaseStudent, 'main')
    private studentRepository: Repository<BaseStudent>,
  ) {}

  public async searchByName(
    name: string,
    take = 10,
    skip = 0,
  ): Promise<{ data: BaseStudent[]; total: number }> {
    const [data, total] = await this.studentRepository.findAndCount({
      where: { name: ILike(`%${name}%`), status: 1 },
      take,
      skip,
      order: { facultyname: 'ASC', spec: 'ASC', cdoc: 'ASC' },
    });
    return { data, total };
  }

  public async findAll(take = 10, skip = 0): Promise<BaseStudent[]> {
    const [data] = await this.studentRepository.findAndCount({
      where: { status: 1 },
      take,
      skip,
      order: { facultyname: 'ASC', spec: 'ASC' },
    });
    return data;
  }

  public async findOne(cdoc: number): Promise<BaseStudent> {
    return this.studentRepository.findOne({ where: { cdoc, status: 1 } });
  }

  public async delete(cdoc: number): Promise<BaseStudent> {
    return (await this.studentRepository.delete({ cdoc, status: 1 })).raw[0];
  }
}
