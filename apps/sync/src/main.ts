import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import * as fs from 'fs';
import { Queue } from 'bullmq';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import sslConfig from '@libs/configs/ssl';
import redisConfig from '@libs/configs/redis';
import authSessionMiddleware from '@libs/core/auth/middlewares/session';
import { AppModule } from './main.module';

const port = process.env.PORT ?? 8683;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const extra: NestApplicationOptions = {
    cors: true,
  };

  if (sslConfig.ssl) {
    extra.httpsOptions = {
      key: fs.readFileSync(sslConfig.key, 'utf8'),
      cert: fs.readFileSync(sslConfig.cert, 'utf8'),
    };
    console.debug(extra);
  }

  const config = new DocumentBuilder()
    .setTitle('KMA Vote Sync Service')
    .setDescription('KMA Vote Sync Service description')
    .setVersion('0.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  authSessionMiddleware(app);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const queue = new Queue('sync', { connection: redisConfig });

  createBullBoard({
    queues: [new BullMQAdapter(queue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  await app.listen(port);
  return app;
}
bootstrap().then(async (app) => {
  console.log(`Application is running on: ${await app.getUrl()}`);
});
