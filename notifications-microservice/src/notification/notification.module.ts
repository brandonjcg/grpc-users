import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

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
            url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : 'notification-service'}:50052`,
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
            url: `${configService.get<string>('NODE_ENV') === 'development' ? 'localhost' : 'user-service'}:50051`,
            package: 'user',
            protoPath: join(__dirname, '../../../proto/user.proto'),
          },
        }),
      },
    ]),
  ],
})
export class NotificationModule {}
