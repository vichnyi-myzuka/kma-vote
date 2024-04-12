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

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Election, ElectionOption, BaseStudent, User, ElectionResult, Vote],
      'main',
    ),
  ],
  providers: [TasksService],
  controllers: [],
})
export class TasksModule {}
