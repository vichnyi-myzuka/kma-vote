import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  BaseStudent,
  Election,
  ElectionOption,
  ElectionResult,
  User,
  Vote,
} from '@libs/core/database/entities';
import { TasksService } from './tasks.service';
import { ElectionService } from '@app/kma-vote/modules/election/services';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Election, ElectionOption, BaseStudent, User, ElectionResult, Vote],
      'main',
    ),
  ],
  providers: [TasksService, ElectionService],
  controllers: [],
})
export class TasksModule {}
