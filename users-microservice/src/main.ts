import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../../proto/user.proto'),
      url: 'localhost:50051',
    },
  });

  await microservice
    .listen()
    .then(() => {
      console.log(`User microservice is running on port 50051 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the microservice:', err);
    });

  await app
    .listen(3000)
    .then(() => {
      console.log(`HTTP server is running on http://localhost:3000 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the app:', err);
    });
}

bootstrap();
