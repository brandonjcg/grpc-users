import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  GrpcMethod,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import {
  NotificationRequest,
  NotificationResponse,
} from './notification.interface';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  private readonly logger = new Logger('Notifications');

  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification({
    id = '',
    message = '',
  }: NotificationRequest): Promise<NotificationResponse> {
    try {
      const userInfo = await this.notificationService.getDataOfUserById(id);
      const newMessage = `Notification sent to ${userInfo.user.name} with message: ${message}`;
      return {
        success: true,
        message: newMessage,
      };
    } catch (error) {
      throw new RpcException({
        code: 14,
        message: (error as Error).message,
      });
    }
  }

  @EventPattern('user.updated')
  handleUserUpdates(@Payload() message: any) {
    this.logger.log(
      `Message received through RabbitMQ: ${JSON.stringify(message)}`,
    );
  }
}
