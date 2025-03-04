import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: 'notification',
          protoPath: join(__dirname, '../../../proto/notification.proto'),
        },
      },
    ]),
  ],
})
export class NotificationModule {}
