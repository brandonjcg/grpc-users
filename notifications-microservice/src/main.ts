import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { rabbitMQConfig } from './config/rabbitmq.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const microserviceGrpc =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, '../../proto/notification.proto'),
        url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : configService.get<string>('HOSTNAME_NOTIFICATION_SERVICE')}:50052`,
      },
    });

  await microserviceGrpc
    .listen()
    .then(() => {
      console.log(`Notification microservice is running on port 50052 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the microservice:', err);
    });

  const microRabbit = app.connectMicroservice(
    rabbitMQConfig({
      queue: 'notification-service',
      url: configService.get<string>('RABBITMQ_URL'),
    }),
  );
  await microRabbit
    .listen()
    .then(() => {
      console.log('Notification microservice is running on RabbitMQ 🚀');
    })
    .catch((err) => {
      console.error('Error starting the microservice:', err);
    });
}

bootstrap();
