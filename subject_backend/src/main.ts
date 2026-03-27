import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { appPrefix } from './common/prefix';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('SubjectsAPI-Main');

  const app = await NestFactory.create(AppModule);
  logger.log("Url para las imagenes",process.env.BASE_URL)

  const config = new DocumentBuilder()
    .setTitle('Subjects Subscription API') 
    .setDescription(
      'Sistema de gestion de asignaturas optativas para la Carrera Ingenieria en Ciencias Informaticas en la UCI',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'Bearer', 
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${appPrefix}/swagger`, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  document.paths = Object.keys(document.paths).reduce((acc, path) => {
    acc[`/${appPrefix}${path}`] = document.paths[path];
    return acc;
  }, {});

  app.enableCors({
    origin: [
      'http://localhost:3000',   
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix(appPrefix);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, // IMPORTANTE
      },
    }),
  );

  await app.listen(envs.port);
  logger.log(`Subjects REST API running on port ${envs.port}`);
}
bootstrap();
