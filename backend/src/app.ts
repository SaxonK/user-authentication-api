import "reflect-metadata";
import type Controller from '@/utils/interfaces/controller.interface';
import express, { Application } from 'express';
import { DataSource } from "typeorm";
import compression from 'compression';
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], dataSource: DataSource, port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection(dataSource);
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  };

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser(process.env.COOKIE_SIGNATURE));
  };

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach(controller => {
      this.express.use('/api', controller.router);
    });
  };

  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  };

  private async initialiseDatabaseConnection(dataSource: DataSource): Promise<void> {
    try {
      await dataSource.initialize();
      console.log("✅ Database connected successfully!!");
    } catch (error) {
      console.error("❌ Database connection error:", error);
      process.exit(1);
    };
  };

  public start(): void {
    this.express.listen(this.port, () => {
      console.log(`✅ Server is running on port: ${this.port}!`);
    });
  };
};

export default App;