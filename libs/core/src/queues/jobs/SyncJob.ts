import { Job } from 'bullmq';
import { StudentFilter } from '@libs/core/database/types';
export class SyncJob extends Job<StudentFilter> {}
