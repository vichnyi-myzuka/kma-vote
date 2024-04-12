import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  BaseStudent,
  Election,
  ElectionOption,
  ElectionResult,
  User,
  Vote,
} from '@libs/core/database/entities';
export class TasksService {
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
}
