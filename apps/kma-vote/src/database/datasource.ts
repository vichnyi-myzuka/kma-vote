import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import options from '@libs/configs/database/postgre.options';
const AppDataSource = new DataSource(options);
export default AppDataSource;
AppDataSource.initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));
