import { WinLogger } from '../common/logger/winlogger';
import { Config } from '../config/config';
import { Client } from 'elasticsearch';

/**
 * Manager du repository ES
*/
export class RepositoryManager {

  private static logger = WinLogger.get('repository-manager');

  /** Initialise la connection à l'ES */
  public static client(): Client {
    return new Client({
      host: Config.get().ES_URL,
      log: Config.get().ES_LOG_LEVEL
    });
  }

  public static async pingServer() {
    this.logger.info('Tentative de contact du serveur ElasticSearch');

    await this.client().ping({
      requestTimeout: 1000
    });
  }
}
