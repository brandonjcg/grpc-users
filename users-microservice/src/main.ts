import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const globalPrefix = 'api/v1';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('User documentation')
    .setDescription('CRUD operations for users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    customSiteTitle: 'User API Documentation',
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../../proto/user.proto'),
      url: `${process.env.NODE_ENV === 'development' ? 'localhost' : 'user-service'}:50051`,
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
      console.log(`HTTP server is running on http://0.0.0.0:3000 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the app:', err);
    });
}

bootstrap();
