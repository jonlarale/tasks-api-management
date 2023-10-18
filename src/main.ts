import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Config
  const config = new DocumentBuilder()
    .setTitle(process.env.TITLE)
    .setDescription(process.env.DESCRIPTION)
    .setVersion(process.env.VERSION)
    .build();

  // Swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.DOCUMENTATION_PATH, app, document);

  // Microservices
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: Number(process.env.PORT),
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
