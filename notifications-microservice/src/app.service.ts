import { GrpcMethod } from '@nestjs/microservices';

interface NotificationRequest {
  idUser: string;
  message: string;
}

interface NotificationResponse {
  success: boolean;
  message: string;
}

export class NotificationService {
  @GrpcMethod('NotificationService', 'SendNotification')
  sendNotification({
    idUser = '',
    message = '',
  }: NotificationRequest): NotificationResponse {
    const messageFormatted = `Notification sent to user ${idUser}: ${message}`;

    return {
      success: true,
      message: messageFormatted,
    };
  }
}
