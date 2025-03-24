import { cleanEnv, str, port } from "envalid";

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production']
    }),
    PORT: port({ default: 3000 }),
    POSTGRES_DB_PORT: port({ default: 5432 }),
    POSTGRES_DB: str(),
    POSTGRES_DB_PATH: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    COOKIE_SIGNATURE: str(),
    JWT_ACCESS_SECRET: str(),
    JWT_REFRESH_SECRET: str()
  });
};

export default validateEnv;