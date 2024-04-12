import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ElectionOption, BaseStudent } from '@libs/core/database/entities';
import { ElectionOptionDto, UpdateElectionOptionDto } from '@libs/core/dto';

@Injectable()
export class ElectionOptionService {
  constructor(
    @InjectRepository(ElectionOption, 'main')
    private electionOptionService: Repository<ElectionOption>,
    @InjectRepository(BaseStudent, 'main')
    private studentService: Repository<BaseStudent>,
  ) {}

  public async create(
    electionOptionDto: ElectionOptionDto,
  ): Promise<ElectionOption> {
    const electionOption = new ElectionOption();
    let election;
    try {
      election = await this.electionOptionService.findOne({
        where: { id: electionOptionDto.id },
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Election with this id does not exist!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let student: BaseStudent;
    try {
      student = await this.studentService.findOne({
        where: { cdoc: electionOptionDto.studentId },
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Student with this id does not exist!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    electionOption.student = student;
    electionOption.description = electionOptionDto.description;

    try {
      await this.electionOptionService.save(electionOption);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    election.options.push(electionOption);

    try {
      await this.electionOptionService.save(election);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return electionOption;
  }

  public async delete(id: number): Promise<ElectionOption> {
    return (await this.electionOptionService.delete({ id })).raw[0];
  }

  public async update(
    id: number,
    updateElectionOptionDto: UpdateElectionOptionDto,
  ): Promise<ElectionOption> {
    return (
      await this.electionOptionService.update(
        { id },
        { ...updateElectionOptionDto },
      )
    ).raw[0];
  }
}
