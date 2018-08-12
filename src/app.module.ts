import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './routes/authentication.controller';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { FunctionalExceptionFilter } from './common/exception/function-exception.filter';
import { TechnicalExceptionFilter } from './common/exception/technical-exception.filter';
import { JwtStrategy } from './security/jwt.strategy';
import { AuthMiddleware } from './security/auth.middleware';
import { AuthService } from './security/auth.service';
import { AuthGuard } from './security/guards/auth.guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from './repository/repository.module';
import { Config } from './config/config';

@Module({
  imports: [RepositoryModule, TypeOrmModule.forRoot({
    type: 'mongodb',
    host: Config.get().MONGO_URL,
    port: Config.get().MONGO_PORT,
    database : 'univ-auth',
    entities: [Config.get().ENTITIES_DIR || './dist/repository/**/*.entity.js'],
    synchronize: true,
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: FunctionalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TechnicalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
