import { AppModule } from '../src/app.module';
import { WinLogger } from '../src/common/logger/winlogger';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Config } from '../src/config/config';

/**
 * Classe permettant d'avoir une instance unique du serveur
 * pour la gestion des tests
 */
export class TestServer {

  private static logger = WinLogger.get('test');
  private static _app: INestApplication;
  private static _module: TestingModule;

  /** Bootstrap the test server and return the application */
  static async bootstrap(): Promise<any> {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    this._module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const connection = this._module.get(Connection);
    connection.dropDatabase();

    this._app = this._module.createNestApplication();
    this._app.setGlobalPrefix(Config.get().SERVER_PATH);
    await this._app.init();
  }

  static getApplication(): INestApplication {
    return this._app;
  }

  static getHttpServer() {
    return this._app.getHttpServer();
  }

  static getLogger() {
    return this.logger;
  }
}
