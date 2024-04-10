import { QueueOptions } from 'bullmq';
import redisOptions from '@libs/configs/redis';

const options: QueueOptions = {
  connection: redisOptions,
};

export default options;
