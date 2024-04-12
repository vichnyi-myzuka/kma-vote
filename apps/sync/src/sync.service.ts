import { SqlServerStudent } from '@libs/core/database/entities';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectEntityManager } from '@nestjs/typeorm/dist';
import { EntityManager } from 'typeorm';
import { StudentFilter } from '@libs/core/database/types';
import SqlServerSelectQueryBuilder from '@libs/core/database/utils/querybuilder';
import { SyncJob } from '@libs/core/queues/jobs';

@Injectable()
export class SyncService {
  constructor(
    @InjectEntityManager('optima')
    private entityManager: EntityManager,
    @InjectQueue('sync') private syncQueue: Queue,
  ) {}

  private queryBuilder = new SqlServerSelectQueryBuilder<SqlServerStudent>(
    this.entityManager.connection,
  )
    .from(SqlServerStudent, 'Student')
    .select('Student');

  public async getAllStudents(): Promise<SqlServerStudent[]> {
    return this.queryBuilder.getMany();
  }

  public async getOneStudent(): Promise<SqlServerStudent> {
    return this.queryBuilder.getOne();
  }

  public async startSync(filter?: StudentFilter): Promise<SyncJob> {
    return await this.syncQueue.add('sync', filter);
  }

  public async stopSync(): Promise<void> {
    return await this.syncQueue.obliterate({ force: true });
  }

  public async getAllActiveJobs(): Promise<SyncJob[]> {
    return await this.syncQueue.getActive();
  }
}
