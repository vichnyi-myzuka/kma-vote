import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { SqlServerStudent, BaseStudent } from '@libs/core/database/entities';
import { SyncService } from './sync.service';
import { SyncProcessor } from './sync.provider';
import { SyncController } from './sync.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseStudent], 'main'),
    TypeOrmModule.forFeature([SqlServerStudent], 'optima'),
    BullModule.registerQueue({ name: 'sync' }),
  ],
  providers: [SyncService, SyncProcessor],
  controllers: [SyncController],
})
export class SyncModule {}
