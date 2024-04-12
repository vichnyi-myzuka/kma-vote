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
import * as controllers from './controllers';
import * as services from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Election, ElectionOption, BaseStudent, User, ElectionResult, Vote],
      'main',
    ),
  ],
  providers: [...Object.values(services)],
  controllers: [...Object.values(controllers)],
})
export class ElectionModule {}
