import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseStudent } from '@libs/core/database/entities';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BaseStudent], 'main')],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
