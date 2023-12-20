import { MiddlewareConsumer, Module, NestModule,RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FcmLibModule } from '@app/fcm-lib';
import { configure } from 'log4js';
import { LoggerMiddleware } from './shared/logger.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.database.env', '.app.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        UserEntity
      ],
      // "./customer/entities/**.entity{.ts,.js}",
      synchronize: false,
      timezone: "Asia/Ho_Chi_Minh"
    }),
    TypeOrmModule.forFeature([
      UserEntity
    ]),
    FcmLibModule
  ],
  controllers: [
    AppController
  ],
  providers: [ AppService ],
})
export class AppModule  implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
  }
}
