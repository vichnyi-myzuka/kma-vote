import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { InjectEntityManager } from '@nestjs/typeorm/dist';
import { EntityManager } from 'typeorm';
import { SqlServerStudent, BaseStudent } from '@libs/core/database/entities';
import { SyncJob } from '@libs/core/queues/jobs';
import { StudentFilter } from '@libs/core/database/types';
import SqlServerSelectQueryBuilder from '@libs/core/database/utils/querybuilder';

@Processor('sync', { concurrency: 1 })
export class SyncProcessor extends WorkerHost {
  constructor(
    @InjectEntityManager('optima')
    private optimaEntityManager: EntityManager,
    @InjectEntityManager('main')
    private mainEntityManager: EntityManager,
  ) {
    super();
  }

  private queryBuilder = new SqlServerSelectQueryBuilder<SqlServerStudent>(
    this.optimaEntityManager.connection,
  )
    .from(SqlServerStudent, 'Student')
    .select('Student');

  private counter = 0;
  private currentOffset = 0;
  private STUDENTS_LIMIT = 500;

  async process(job: SyncJob): Promise<any> {
    const { data } = job;
    let query = this.queryBuilder.limit(this.STUDENTS_LIMIT);
    const studentFilterProperties = StudentFilter.getAllProperties();
    Object.keys(data).forEach((propertyName, index) => {
      if (studentFilterProperties[propertyName]) {
        const whereQuery = `Student.${
          StudentFilter.getAllProperties()[propertyName]
        } = :${propertyName}`;
        const parameter = { [propertyName]: data[propertyName] };
        if (index === 0) {
          query = query.where(whereQuery, parameter);
        } else {
          query = query.andWhere(whereQuery, parameter);
        }
      }
    });

    let currentResults: SqlServerStudent[];

    console.log(job.id + ' ' + JSON.stringify(job.data) + ' is processing');
    do {
      currentResults = await query.offset(this.currentOffset).getMany();
      console.log('Current offset is ' + this.currentOffset);
      this.currentOffset += this.STUDENTS_LIMIT;
      if (currentResults.length > 0) {
        await this.performSync(currentResults);
      }
    } while (currentResults.length > 0);
  }

  async performSync(optimaStudents: SqlServerStudent[]): Promise<void> {
    this.counter += optimaStudents.length;
    await this.mainEntityManager
      .getRepository(BaseStudent)
      .upsert(optimaStudents, ['cdoc']);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: SyncJob): void {
    console.log(job.id + ' is done, results length: ' + this.counter);
    this.counter = 0;
    this.currentOffset = 0;
  }
}
