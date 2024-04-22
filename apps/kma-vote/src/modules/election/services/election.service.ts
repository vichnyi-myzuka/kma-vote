import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as console from 'console';

import {
  BaseStudent,
  Election,
  ElectionOption,
  ElectionResult,
  User,
  Vote,
} from '@libs/core/database/entities';
import { ElectionStatus, Role } from '@libs/core/database/enums';
import { ElectionsFilterModel } from '@libs/core/database/types';
import { ElectionDataDto } from '@libs/core/dto';
import type { UserRequest } from '@libs/core/auth/types';
import {
  getArrayValueJsonQuery,
  getStringValueJsonQuery,
} from '@libs/core/database/utils';

@Injectable()
export class ElectionService {
  constructor(
    @InjectRepository(Election, 'main')
    private electionRepository: Repository<Election>,
    @InjectRepository(ElectionOption, 'main')
    private electionOptionRepository: Repository<ElectionOption>,
    @InjectRepository(BaseStudent, 'main')
    private studentService: Repository<BaseStudent>,
    @InjectRepository(Vote, 'main') private voteRepository: Repository<Vote>,
    @InjectRepository(ElectionResult, 'main')
    private electionResultRepository: Repository<ElectionResult>,
    @InjectRepository(User, 'main') private userRepository: Repository<User>,
  ) {}

  public async findAll(
    userRequest: UserRequest,
    take = 10,
    skip = 0,
    filter: string,
  ): Promise<{ data: Election[]; total: number }> {
    const user = userRequest?.user;

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Необхідно авторизуватись!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { status } = JSON.parse(filter) as ElectionsFilterModel;
    const [data, total] = await this.electionRepository.findAndCount({
      take,
      skip,
      order: { startDate: 'DESC', endDate: 'DESC', status: 'ASC' },
      where: {
        status,
        hide: user.roles.includes(Role.Admin) ? undefined : false,
      },
    });
    return { data, total };
  }

  public async findOne(
    userRequest: UserRequest,
    id: number,
  ): Promise<Election> {
    const election = await this.electionRepository.findOne({ where: { id } });

    if (!election) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Голосування не знайдено!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userRequest?.user.roles.includes(Role.Admin) && election.hide) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Голосування приховано!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return election;
  }

  public async canVote(userRequest: UserRequest, id: number): Promise<boolean> {
    const election = await this.electionRepository.findOne({ where: { id } });

    if (!election) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Голосування не знайдено!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (election.status !== ElectionStatus.IN_PROGRESS) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Голосування не розпочалося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (election.endDate < new Date()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Голосування вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const student = await this.studentService.findOne({
      where: { ukma_email: userRequest?.user?.email },
    });

    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Студента не знайдено!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { facultyName, specialtyName, degreeYear, degreeLevel } =
      election.accessScenarioParams.student;
    const throwForbidden = () => {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Студент не має доступу до голосування!',
        },
        HttpStatus.FORBIDDEN,
      );
    };

    if (facultyName && facultyName !== student.facultyname) {
      throwForbidden();
    }

    if (degreeLevel && degreeLevel !== student.level) {
      throwForbidden();
    }

    if (
      degreeYear.length &&
      !degreeYear.includes(Number.parseInt(student.year))
    ) {
      throwForbidden();
    }

    if (specialtyName.length && !specialtyName.includes(student.spec)) {
      throwForbidden();
    }

    // Check if student has already voted
    const vote = await this.voteRepository.findOne({
      where: {
        user: {
          id: userRequest.user.id,
        },
        options: {
          election: {
            id,
          },
        },
      },
      relations: {
        options: {
          election: true,
        },
        user: true,
      },
    });

    return !vote;
  }

  public async create(electionData: ElectionDataDto): Promise<Election> {
    const { electionOptionDtos, electionDto } = electionData;

    const existingElection = await this.electionRepository.findOne({
      where: { urlKey: electionDto.urlKey },
    });
    if (existingElection) {
      throw new HttpException(
        { message: 'Голосування з таким URL вже існує!' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const options = await Promise.all(
      electionOptionDtos.map(async (electionOptionDto) => {
        const electionOption = new ElectionOption();

        let student: BaseStudent;
        try {
          student = await this.studentService.findOne({
            where: { cdoc: electionOptionDto.studentId },
          });
        } catch (e) {
          throw new HttpException(
            {
              message: `Студента з номер ${electionOptionDto.studentId} не існує!`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        electionOption.student = student;
        electionOption.description = electionOptionDto.description;
        return electionOption;
      }),
    );

    const election = new Election();

    election.description = electionDto.description;
    election.name = electionDto.name;
    election.urlKey = electionDto.urlKey;
    election.minSelectedOptions = electionDto.minSelectedOptions;
    election.maxSelectedOptions = electionDto.maxSelectedOptions;
    election.accessScenarioParams = electionDto.accessScenarioParams;
    election.hide = electionDto.hide;
    election.startDate = electionDto.startDate;
    election.endDate = electionDto.endDate;
    election.status = electionDto.status;
    election.options = options;

    try {
      return await this.electionRepository.save(election);
    } catch (e) {
      // Delete created options
      await this.electionOptionRepository.remove([...options]);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findSelectedStudents(
    userRequest: UserRequest,
    id: number,
  ): Promise<BaseStudent[]> {
    const election = await this.electionRepository.findOne({
      where: { id },
      relations: {
        options: {
          student: true,
        },
      },
    });

    if (!election) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Голосування не знайдено!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userRequest?.user?.roles.includes(Role.Admin) && election.hide) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Голосування приховано!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return election.options.map((option) => option.student);
  }

  public async delete(id: number): Promise<Election> {
    return (await this.electionRepository.delete({ id })).raw[0];
  }

  public async update(
    id: number,
    electionDataDto: ElectionDataDto,
  ): Promise<Election> {
    const { electionDto, electionOptionDtos } = electionDataDto;
    const election = await this.electionRepository.findOne({
      where: { id },
      relations: {
        options: {
          student: true,
        },
      },
    });

    //If election start date or end date is in the past, do not allow to change it
    if (
      electionDto.startDate < new Date() ||
      electionDto.endDate < new Date()
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо змінити голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //If election start date is after end date, do not allow to change it
    if (electionDto.startDate > electionDto.endDate) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Дата початку голосування не може бути пізніше дати закінчення!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // If election is in progress, do not allow to change it
    if (election.status !== ElectionStatus.NOT_STARTED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо змінити голосування, яке вже розпочалося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const options = [];
    const optionsToDelete = election.options.filter((option) => {
      return !electionOptionDtos.some(
        (optionDto) => optionDto.studentId === option.student.cdoc,
      );
    });

    // Delete options that are not in the new list
    if (optionsToDelete.length) {
      await this.electionOptionRepository.remove(optionsToDelete);
    }

    // Update existing options and create new ones
    for (const electionOptionDto of electionOptionDtos) {
      const existingOption: ElectionOption | null =
        await this.electionOptionRepository.findOne({
          where: {
            student: {
              cdoc: electionOptionDto.studentId,
            },
            election: {
              id: election.id,
            },
          },
          relations: ['student', 'election'],
        });

      if (existingOption) {
        existingOption.description = electionOptionDto.description;
        options.push(existingOption);
      } else {
        const student = await this.studentService.findOne({
          where: {
            cdoc: electionOptionDto.studentId,
          },
        });

        if (!student) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: `Студента з номером ${electionOptionDto.studentId} не існує!`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const newOption = new ElectionOption();
        newOption.student = student;
        newOption.description = electionOptionDto.description;
        options.push(newOption);
      }
    }

    // Update election
    Object.assign(election, {
      ...electionDto,
      options,
    });

    return await this.electionRepository.save(election);
  }

  public async hide(id: number): Promise<Election> {
    return (await this.electionRepository.update({ id }, { hide: true }))
      .raw[0];
  }

  public async show(id: number): Promise<Election> {
    return (await this.electionRepository.update({ id }, { hide: false }))
      .raw[0];
  }

  public async findBySlug(
    userRequest: UserRequest,
    slug: string,
  ): Promise<{ election: Election; isVoted: boolean }> {
    const election = await this.electionRepository.findOne({
      where: { urlKey: slug },
    });

    if (!election) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Голосування не знайдено!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepository.findOne({
      where: { email: userRequest?.user?.email },
    });

    if (!user || !userRequest.user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Користувача не знайдено!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(userRequest.user);

    if (!userRequest?.user.roles.includes(Role.Admin) && election.hide) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Голосування приховано!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const isVoted = !!(await this.voteRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        options: {
          election: {
            id: election.id,
          },
        },
      },
      relations: {
        user: true,
        options: {
          election: true,
        },
      },
    }));

    return { election, isVoted };
  }

  public async start(id: number): Promise<Election> {
    const election = await this.electionRepository.findOne({ where: { id } });
    // If election end time is in the past, do not start it
    if (election.endDate < new Date()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо почати голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return (
      await this.electionRepository.update(
        { id },
        { status: ElectionStatus.IN_PROGRESS, startDate: new Date() },
      )
    ).raw[0];
  }

  public async cancel(id: number): Promise<Election> {
    const election = await this.electionRepository.findOne({ where: { id } });
    if (election.status === ElectionStatus.COMPLETED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо скасувати голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return (
      await this.electionRepository.update(
        { id },
        { status: ElectionStatus.CANCELLED },
      )
    ).raw[0];
  }

  public async complete(id: number): Promise<Election> {
    const election = await this.electionRepository.findOne({
      where: { id },
      relations: {
        options: {
          student: true,
        },
      },
    });
    if (election.status === ElectionStatus.COMPLETED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо завершити голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (election.status !== ElectionStatus.IN_PROGRESS) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо завершити голосування, яке не розпочалося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const option of election.options) {
      const electionResult = new ElectionResult();
      electionResult.election = election;
      electionResult.option = option;
      electionResult.student = option.student;
      const votes = await this.voteRepository.find({
        where: {
          options: {
            id: option.id,
          },
        },
      });
      electionResult.votes = votes.length;
      await this.electionResultRepository.save(electionResult);
    }

    return (
      await this.electionRepository.update(
        { id },
        { status: ElectionStatus.COMPLETED, endDate: new Date() },
      )
    ).raw[0];
  }

  public async pause(id: number): Promise<Election> {
    const election = await this.electionRepository.findOne({ where: { id } });
    if (election.status === ElectionStatus.COMPLETED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо призупинити голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (election.status !== ElectionStatus.IN_PROGRESS) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо призупинити голосування, яке не розпочалося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return (
      await this.electionRepository.update(
        { id },
        { status: ElectionStatus.PAUSED },
      )
    ).raw[0];
  }

  public async resume(id: number): Promise<Election> {
    const election = await this.electionRepository.findOne({ where: { id } });
    if (election.status === ElectionStatus.COMPLETED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо відновити голосування, яке вже закінчилося!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (election.status !== ElectionStatus.PAUSED) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Неможливо відновити голосування, яке не призупинено!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return (
      await this.electionRepository.update(
        { id },
        { status: ElectionStatus.IN_PROGRESS },
      )
    ).raw[0];
  }

  public async findAllAvailableElections(
    userRequest: UserRequest,
    paginationParams: {
      take: number;
      skip: number;
    },
  ): Promise<{ data: Election[]; total: number }> {
    const user = userRequest?.user;

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Необхідно авторизуватись!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const student = await this.studentService.findOne({
      where: { ukma_email: user.email },
    });

    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Студента не знайдено!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { facultyname, level, spec, year } = student;
    let query = this.electionRepository
      .createQueryBuilder('election')
      .leftJoinAndSelect('election.options', 'options')
      .leftJoinAndSelect('options.student', 'student')
      .where(getStringValueJsonQuery('election', 'degreeLevel', level))
      .andWhere(getStringValueJsonQuery('election', 'facultyName', facultyname))
      .andWhere(getArrayValueJsonQuery('election', 'degreeYear', year))
      .andWhere(getArrayValueJsonQuery('election', 'specialtyName', spec))
      .andWhere('election.status = :inProgress', {
        inProgress: ElectionStatus.IN_PROGRESS,
      });

    if (!user.roles.includes(Role.Admin)) {
      query = query.andWhere('election.hide = false');
    }

    const userVotesElectionsIds = (
      await this.voteRepository
        .createQueryBuilder('vote')
        .leftJoinAndSelect('vote.options', 'options')
        .select('DISTINCT ON (options.electionId) options.electionId')
        .where('vote.userId = :userId', { userId: user.id })
        .getRawMany()
    ).map((vote: { electionId: number }) => vote.electionId);

    const allElections = (await query.getMany()).filter(
      (election) => !userVotesElectionsIds.includes(election.id),
    );
    const total = allElections.length;
    const data = allElections.slice(
      paginationParams.skip,
      paginationParams.skip + paginationParams.take,
    );

    return { data, total };
  }

  public async getElectionResults(id: number): Promise<ElectionResult[]> {
    const election = await this.electionRepository.findOne({ where: { id } });

    if (!election) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Голосування не знайдено!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.electionResultRepository.find({
      where: {
        election: {
          id,
        },
      },
    });
  }

  public async getVotedElections(
    userRequest: UserRequest,
    take = 10,
    skip = 0,
  ): Promise<{
    data: Election[];
    total: number;
  }> {
    const user = userRequest?.user;

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Необхідно авторизуватись!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userVotesElectionsIds = (
      await this.voteRepository
        .createQueryBuilder('vote')
        .leftJoinAndSelect('vote.options', 'options')
        .select('DISTINCT ON (options.electionId) options.electionId')
        .where('vote.userId = :userId', { userId: user.id })
        .getRawMany()
    ).map((vote: { electionId: number }) => vote.electionId);

    const votedElections = await this.electionRepository.find({
      where: {
        id: In(userVotesElectionsIds),
      },
    });

    return {
      data: votedElections.slice(skip, skip + take),
      total: votedElections.length,
    };
  }
}
