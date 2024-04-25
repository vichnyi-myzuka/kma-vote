import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import mssqlOptions from '@libs/configs/database/mohyla.options';
import postgreOptions from '@libs/configs/database/postgre.options';
import bullOptions from '@libs/configs/bull';
import { AuthModule } from '@libs/core/auth/module/auth.module';
import { SyncModule } from './sync.module';

export const syncQueue = BullModule.registerQueue({
  name: 'sync',
});

@Module({
  imports: [
    TypeOrmModule.forRoot(mssqlOptions),
    TypeOrmModule.forRoot(postgreOptions),
    BullModule.forRoot(bullOptions),
    AuthModule,
    SyncModule,
  ],
  controllers: [],
  exports: [syncQueue],
})
export class AppModule {}
