import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'notification',
      protoPath: join(__dirname, '../../proto/notification.proto'),
      url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : configService.get<string>('HOSTNAME_NOTIFICATION_SERVICE')}:50052`,
    },
  };

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      microserviceOptions,
    );

  await microservice
    .listen()
    .then(() => {
      console.log(`Notification microservice is running on port 50052 🚀`);
    })
    .catch((err) => {
      console.error('Error starting the microservice:', err);
    });
}

bootstrap();
