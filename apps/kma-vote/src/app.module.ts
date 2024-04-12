import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';

import options from '@libs/configs/database/postgre.options';
import { RolesGuard } from '@libs/core/auth/guards';
import * as ModulesList from '@app/kma-vote/modules';

console.log('Typeorm settings:', options);
@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'dist', 'apps', 'client'),
      renderPath: '/',
      exclude: ['/api/(.*)', '/auth/(.*)'],
      serveStaticOptions: {
        redirect: true,
      },
    }),
    ...Object.values(ModulesList),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
