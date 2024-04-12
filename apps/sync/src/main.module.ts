import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import mssqlOptions from '@libs/configs/database/mohyla.options';
import postgreOptions from '@libs/configs/database/postgre.options';
import bullOptions from '@libs/configs/bull';
import { SyncModule } from './sync.module';
import { AuthModule } from '@libs/core/auth/module';

export const syncQueue = BullModule.registerQueue({
  name: 'sync',
});

const databaseInitModules = [
  TypeOrmModule.forRoot(mssqlOptions),
  TypeOrmModule.forRoot(postgreOptions),
];
const bullInitModules = [BullModule.forRoot(bullOptions)];
const appModules = [SyncModule, AuthModule];

@Module({
  imports: [...databaseInitModules, ...bullInitModules, ...appModules],
  controllers: [],
  exports: [syncQueue],
})
export class AppModule {}
