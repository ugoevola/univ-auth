import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinLogger } from './common/logger/winlogger';
import { Config } from './config/config';

const logger: WinLogger = WinLogger.get('authentification-service');

/**
 * Bootstrap de l'application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger : WinLogger.get('nest'),
  });

  const swaggerActivated = Config.get().SWAGGER_ACTIVATED;
  if (swaggerActivated) {
    const packageJson = require('../package.json');

    const options = new DocumentBuilder()
      .setTitle('Auth server')
      .setDescription(packageJson.description)
      .setVersion(packageJson.version)
      .setBasePath(Config.get().SERVER_PATH)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/swagger', app, document);
  }

  const serverPort = Config.get().SERVER_PORT;
  app.setGlobalPrefix(Config.get().SERVER_PATH);
  await app.listen(Config.get().SERVER_PORT);
  if (swaggerActivated) {
    logger.info('Swagger is activated and is accessible on /api/swagger');
  }
  logger.info(`Server started on port ${serverPort}`);
}
bootstrap();
