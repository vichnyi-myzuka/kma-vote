import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import options from '@libs/configs/database/mohyla.options';

export const MohylaDataSource = new DataSource(options);

MohylaDataSource.initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));
