import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import options from '@libs/configs/database/postgre.options';

export const StudentsDataSource = new DataSource(options);

StudentsDataSource.initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));
