import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3000', // Front ip
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap()
  .then(() =>
    console.log(
      `Приложение успешно запустилось на порте: ${process.env.PORT ?? 3001}`,
    ),
  )
  .catch((err) =>
    console.error('Произошла ошибка при запуске приложения', err),
  );
