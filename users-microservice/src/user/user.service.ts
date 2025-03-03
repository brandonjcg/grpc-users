import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { users } from './data';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  async createUser(createUserDto: CreateUserDto) {
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...createUserDto,
    };

    users.push(newUser);

    const response = await firstValueFrom(
      this.notificationService.sendNotification({
        id: newUser.id,
        message: `User ${newUser.name} created with success`,
      }),
    );

    return response;
  }
}
