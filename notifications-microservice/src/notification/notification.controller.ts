import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  NotificationRequest,
  NotificationResponse,
} from './notification.interface';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification({
    id = '',
    message = '',
  }: NotificationRequest): Promise<NotificationResponse> {
    const userInfo = await this.notificationService.getDataOfUserById(id);
    const newMessage = `Notification sent to ${userInfo.user.name} with message: ${message}`;
    return {
      success: true,
      message: newMessage,
    };
  }
}
