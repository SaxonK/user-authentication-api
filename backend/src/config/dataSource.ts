import { DataSource } from 'typeorm';
import { User } from '@/resources/user/user.model';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_PATH,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: true,
  logging: false,
});

export default AppDataSource;