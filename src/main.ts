import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ApiBasicAuth } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { RESPONSE_CODE } from './shared/constant';
import { HttpExceptionFilter } from './shared/http-exception.filter';
var bodyParser = require('body-parser');

async function bootstrap() {
  const appOptions = {
    cors: true
  };
  const app = await NestFactory.create(AppModule,appOptions);
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          code: RESPONSE_CODE.INVALID_DATA_REQUEST,
          message: validationErrors.map((error) => {return Object.values(error.constraints)}).join(' ')
        }
        // validationErrors.map((error) => ({
        //   field: error.property,
        //   error: Object.values(error.constraints).join(', '),
        // })),
      );
    },
  }));
  app.use(bodyParser.json({
    limit: '50mb'
  }));
  // app.enableCors()
  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  //   credentials: true,
  // });

  const options = new DocumentBuilder()
    .setTitle('Virtual Number')
    .setDescription('Virtual Number API description - 2022')
    .setVersion('1.0')
    .setBasePath('virtual-number/api')
    .addBearerAuth()
    // .addServer("http://10.9.5.149:5000")
    .build();
    
    app.use(
      [
        '/docs', 
        '/docs-json'
      ],
      basicAuth({
          challenge: true,
          users: {
              gmobile: process.env.PASS_API,
          },
      }),
  );
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
