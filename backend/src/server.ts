
import 'module-alias/register';
import 'dotenv/config';
import App from './app';
import AppDataSource from '@/config/dataSource';
import AuthController from '@/resources/auth/auth.controller';
import UserController from '@/resources/user/user.controller';
import validateEnv from '@/utils/validateEnv';

validateEnv();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = new App([new AuthController(), new UserController()], AppDataSource, PORT);
server.start();