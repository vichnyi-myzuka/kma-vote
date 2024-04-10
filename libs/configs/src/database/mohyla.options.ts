import env from '@libs/core/utils/env';
import { DataSourceOptions } from 'typeorm/data-source';
import { SqlServerStudent } from '@libs/core/database/entities';

const options: DataSourceOptions = {
  type: 'mssql',
  name: 'optima',
  host: env.string('MOHYLA_DB_HOST', 'localhost'),
  port: env.number('MOHYLA_DB_PORT', 1433),
  username: env.string('MOHYLA_DB_USERNAME'),
  password: env.string('MOHYLA_DB_PASSWORD'),
  database: env.string('MOHYLA_DB_DATABASE'),
  synchronize: false,
  logging: true,
  options: {
    encrypt: false,
    tdsVersion: '7_2',
  },
  extra: {
    charset: 'UTF-8',
    trustServerCertificate: true,
  },
  entities: [SqlServerStudent],
};

export default options;
