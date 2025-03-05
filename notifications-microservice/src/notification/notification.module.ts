import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { rabbitMQConfig } from '../config/rabbitmq.options';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : configService.get<string>('HOSTNAME_NOTIFICATION_SERVICE')}:50052`,
            package: 'notification',
            protoPath: join(__dirname, '../../../proto/notification.proto'),
          },
        }),
      },
      {
        name: 'USER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : configService.get<string>('HOSTNAME_USER_SERVICE')}:50051`,
            package: 'user',
            protoPath: join(__dirname, '../../../proto/user.proto'),
          },
        }),
      },
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          rabbitMQConfig({
            queue: 'user_updates',
            url: configService.get<string>('RABBITMQ_URL'),
          }),
      },
    ]),
  ],
})
export class NotificationModule {}
