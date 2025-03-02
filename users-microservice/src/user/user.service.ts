import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { users } from './data';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private notificationService: any;

  constructor(@Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.notificationService = this.client.getService('NotificationService');
  }

  sendNotification(
    notificationRequest: NotificationRequest,
  ): Observable<NotificationResponse> {
    return this.notificationService.SendNotification(notificationRequest);
  }

  getById(idUser: string): User | null {
    return users.find((user) => user.id === idUser) || null;
  }
}
