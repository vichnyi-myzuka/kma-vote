import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UserRequest } from '@libs/core/auth/types';
import {
  BaseStudent,
  Election,
  ElectionOption,
  ElectionResult,
  User,
  Vote,
} from '@libs/core/database/entities';
import { ElectionOptionProgressDto } from '@libs/core/dto';
import { ElectionStatus } from '@libs/core/database/enums';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Election, 'main')
    private electionRepository: Repository<Election>,
    @InjectRepository(BaseStudent, 'main')
    private studentService: Repository<BaseStudent>,
    @InjectRepository(Vote, 'main') private voteRepository: Repository<Vote>,
    @InjectRepository(ElectionResult, 'main')
    private electionResultRepository: Repository<ElectionResult>,
    @InjectRepository(User, 'main') private userRepository: Repository<User>,
  ) {}

  public async getElectionProgress(
    electionId: number,
  ): Promise<ElectionOptionProgressDto[]> {
    const election = await this.electionRepository.findOne({
      where: {
        id: electionId,
      },
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

    const votes = await this.voteRepository.find({
      where: {
        options: {
          election: {
            id: electionId,
          },
        },
      },
      relations: ['options'],
    });

    return election.options.map((option) => {
      const optionVotes = votes.filter((vote) =>
        vote.options.some((v) => v.id === option.id),
      );
      return new ElectionOptionProgressDto(option, optionVotes.length);
    });
  }

  public async voteForStudents(
    userRequest: UserRequest,
    id: number,
    options: ElectionOption[],
  ): Promise<Vote> {
    const election = await this.electionRepository.findOne({
      where: {
        id,
      },
      relations: ['options'],
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

    if (election.status !== ElectionStatus.IN_PROGRESS) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Голосування не активне!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      election.minSelectedOptions > options.length ||
      election.maxSelectedOptions < options.length
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Кількість обраних кандидатів не відповідає вимогам голосування!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userRequest.user.id,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Користувач не знайдений!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const vote = new Vote();
    vote.user = user;
    vote.options = options;

    return this.voteRepository.save(vote);
  }

  public async getUserVotes(
    userRequest: UserRequest,
    electionId: number,
  ): Promise<Vote[]> {
    return this.voteRepository.find({
      where: {
        user: {
          id: userRequest.user.id,
        },
        options: {
          election: {
            id: electionId,
          },
        },
      },
      relations: {
        options: {
          student: true,
        },
      },
    });
  }
}
