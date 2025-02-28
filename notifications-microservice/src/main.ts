import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, '../../proto/notification.proto'),
        url: 'localhost:50052',
      },
    },
  );

  await app
    .listen()
    .then(() => {
      console.log(`Notification microservice is running on port 50052 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the microservice:', err);
    });
}

bootstrap();
