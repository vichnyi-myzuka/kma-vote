import { StudentFilter } from '@libs/core/database/types';
import { SyncJob } from '@libs/core/queues/jobs';
import { Post, Get, Controller, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';
@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly service: SyncService) {}

  @Post('start')
  public async startSync(
    @Body() studentFilter: StudentFilter,
  ): Promise<SyncJob> {
    return this.service.startSync(studentFilter);
  }

  @Post('stop')
  public async stopSync(): Promise<void> {
    return await this.service.stopSync();
  }

  @Get('active')
  public async getAllActiveJobs(): Promise<SyncJob[]> {
    return this.service.getAllActiveJobs();
  }
}
