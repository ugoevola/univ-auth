import { LoggerInstance } from 'winston';
import { LoggerFactory } from './logger.factory';

export class WinLogger {

  private logger: LoggerInstance;

  private constructor(private name: string) {
    this.logger = LoggerFactory.get();
  }

  public static get(name): WinLogger {
    return new WinLogger(name);
  }

  debug(format: string, params?: any) {
    this.logger.debug(`[${this.name}]  -  ${format}`, params);
  }

  info(format: string, params?: any) {
    this.logger.info(`[${this.name}] - ${format}`, params);
  }

  warn(format: string, params?: any) {
    this.logger.warn(`[${this.name}]  - ${format}`, params);
  }

  error(format: string, params?: any) {
    this.logger.error(`[${this.name}]  -  ${format}`, params);
  }

  log(message: string) {
    this.logger.info(`[${this.name}]  -  ${message}`);
  }
}

