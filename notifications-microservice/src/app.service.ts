import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface NotificationRequest {
  idUser: string;
  message: string;
}

interface NotificationResponse {
  success: boolean;
}

@Controller()
export class NotificationService {
  @GrpcMethod('NotificationService', 'SendNotification')
  sendNotification({
    idUser = '',
    message = '',
  }: NotificationRequest): NotificationResponse {
    console.log(`Notification sent to user ${idUser}: ${message}`);

    return {
      success: true,
    };
  }
}
