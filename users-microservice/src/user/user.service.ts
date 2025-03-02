import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { users } from './data';
import { User } from './entities/user.entity';

interface NotificationService {
  sendNotification(data: NotificationRequest): Observable<NotificationResponse>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private notificationService: NotificationService;

  constructor(@Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationService>(
      'NotificationService',
    );
  }

  sendNotification(
    notificationRequest: NotificationRequest,
  ): Observable<NotificationResponse> {
    return this.notificationService.sendNotification(notificationRequest);
  }

  getById(idUser: string): User | null {
    return users.find((user) => user.id === idUser) || null;
  }
}
