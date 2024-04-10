import * as env from '@libs/core/utils/env';
import { RedisOptions } from 'ioredis';

const options: RedisOptions = {
  host: env.string('REDIS_HOST', '127.0.0.1'),
  port: env.number('REDIS_PORT', 6379),
  password: env.string('REDIS_PASS'),
  db: env.number('REDIS_DB', 0),
  keyPrefix: env.string('REDIS_PREFIX', undefined),
};
export default options;
