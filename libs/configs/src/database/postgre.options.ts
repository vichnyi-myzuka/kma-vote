import env from '@libs/core/utils/env';
import { DataSourceOptions } from 'typeorm';
import * as entities from '@libs/core/database/entities';

const config: DataSourceOptions = {
  type: 'postgres',
  name: 'main',
  host: env.string('POSTGRES_HOST', 'localhost'),
  port: env.number('POSTGRES_PORT', 3306),
  username: env.string('POSTGRES_USERNAME', 'root'),
  password: env.string('POSTGRES_PASSWORD', ''),
  database: env.string('POSTGRES_DATABASE'),
  synchronize: env.bool('POSTGRES_SYNCHRONIZE', false),
  logging: env.bool('POSTGRES_LOGGING', false),
  migrationsRun: true,
  extra: {
    charset: 'UTF-8',
  },
  entities: [...Object.values(entities)],
  migrations: ['../../../core/src/database/migrations/**/*{.ts,.js}'],
};

if (env.get('NOVE_ENV') === 'development') {
  console.log('Using DB config from the ormconfig.js file ...');
  console.log(config);
}

export default config;
