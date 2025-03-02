import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  NotificationRequest,
  NotificationResponse,
} from './notification.interface';

@Controller()
export class NotificationController {
  constructor() {}

  @GrpcMethod('NotificationService', 'SendNotification')
  sendNotification({
    id = '',
    message = '',
  }: NotificationRequest): NotificationResponse {
    const messageFormatted = `Notification sent to user ${id}: ${message}`;

    return {
      success: true,
      message: messageFormatted,
    };
  }
}
