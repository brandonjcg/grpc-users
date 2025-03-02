import { Controller, Get, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUserById')
  getUser(data: { id: string }) {
    const user = this.userService.getById(data.id);
    if (!user)
      return {
        success: false,
        message: 'User not found',
        user: null,
      };

    return {
      success: true,
      message: `User with id ${data.id} found`,
      user,
    };
  }

  @Get(':id/notify')
  notifyUser(@Param('id') id: string): Observable<NotificationResponse> {
    const notificationRequest: NotificationRequest = {
      id,
      message: 'This is a notification message',
    };
    return this.userService.sendNotification(notificationRequest);
  }
}
