import { WinLogger } from '../common/logger/winlogger';

// Utilitaire permettant de gérer plus facilement les URLs.
const url_join = require('url-join');
// Utilitaire permettant de faire de l'héritage d'object json
const json_override = require('json-override');

export class Config {

  private static instance: Config;

  private config: {
    MONGO_URL: string,
    MONGO_PORT: number,
    SERVER_PORT: string,
    SERVER_PATH: string,
    LOG_LEVEL: string,
    AUTH_TOKEN_NAME: string,
    AUTH_JWT_KEY: string,
    SWAGGER_ACTIVATED: boolean,
    ADMIN_ACCOUNT: string,
    ADMIN_PWD: string,
    ENTITIES_DIR: string,
  };

  private constructor() {
  }

  // Récuperation de l'instance en singleton
  public static get() {
    if (!this.instance) {
      this.instance = new Config();
      this.instance.init();
    }
    return this.instance.config;
  }

  private init() {
    // Récuperation du dossier de config
    const server_config_folder = process.env.NODE_SERVER_CONFIG_FOLDER || '.';

    // Lecture du fichier default.js
    this.config = this.getConfig(server_config_folder, 'default.js').config;

    // Si on est sur un environnement donné on essait de prendre la configuration associée
    // pour surcharger celle par defaut.
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv) {
      WinLogger.get('config').info(`Loading ${nodeEnv} configuration`);
      try {
        const override = this.getConfig(server_config_folder, `${nodeEnv}.js`).config;
        json_override(this.config, override);
      } catch (error) {
        WinLogger.get('config').warn(`No configuration found for ${nodeEnv}`);
      }
    } else {
      WinLogger.get('config').info(`No configuration specified: using default`);
    }
  }

  private getConfig(path, configName) {
    return require(url_join(path, configName));
  }
}
