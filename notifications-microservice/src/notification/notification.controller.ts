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
    message = '',
  }: NotificationRequest): NotificationResponse {
    console.log(
      `🚀 ${new Date().toLocaleString('en-US', { timeZone: 'America/Tijuana', hour12: false })} ~ notification.controller.ts:19 ~ NotificationController ~ messageFormatted:`,
      message,
    );
    // TODO: creo que aquí falta consultar el micro de user para obtener la info del usuario
    return {
      success: true,
      message,
    };
  }
}
