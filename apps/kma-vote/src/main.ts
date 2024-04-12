import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import type { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

import sslConfig from '@libs/configs/ssl';
import auth from '@libs/core/auth/middlewares/session';
import { HttpExceptionFilter } from '@libs/core/filters';
import { AppModule } from '@app/kma-vote/app.module';
import * as process from 'process';

const port = process.env.PORT ?? 8683;

async function bootstrap(): Promise<INestApplication> {
  const extra: NestApplicationOptions = {
    cors: true,
    snapshot: true,
  };

  if (sslConfig.ssl) {
    extra.httpsOptions = {
      key: fs.readFileSync(sslConfig.key, 'utf8'),
      cert: fs.readFileSync(sslConfig.cert, 'utf8'),
    };
    console.debug(extra);
  }

  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, extra);
  const config = new DocumentBuilder()
    .setTitle('KMA Vote API')
    .setDescription('KMA Vote API description')
    .setVersion('0.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-app', app, document);
  auth(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  return app;
}

bootstrap().then(async (app) => {
  console.log(`Application is running on: ${await app.getUrl()}`);
});
