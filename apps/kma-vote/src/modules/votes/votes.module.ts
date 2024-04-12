import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  BaseStudent,
  Election,
  ElectionResult,
  User,
  Vote,
} from '@libs/core/database/entities';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Election, BaseStudent, ElectionResult, Vote, User],
      'main',
    ),
  ],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
