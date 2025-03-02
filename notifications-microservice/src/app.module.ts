import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'notification',
          protoPath: join(__dirname, '../../proto/notification.proto'),
        },
      },
    ]),
    NotificationModule,
  ],
})
export class AppModule {}
