import { INestApplication } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import sessionConfig from '@libs/configs/session';
import redisConfig from '@libs/configs/redis';

interface AppAuthOptions {
  session?: session.SessionOptions;
}

export default function apply(
  app: INestApplication,
  options?: AppAuthOptions,
): void {
  app.use(
    session({
      store: new RedisStore({
        client: new Redis(redisConfig),
      }),
      ...sessionConfig,
      ...options?.session,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
