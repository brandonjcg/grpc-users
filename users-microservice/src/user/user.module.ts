import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { rabbitMQConfig } from '../config/rabbitmq.options';

@Module({
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
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          rabbitMQConfig({
            queue: 'notification-service',
            url: configService.get<string>('RABBITMQ_URL'),
          }),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
