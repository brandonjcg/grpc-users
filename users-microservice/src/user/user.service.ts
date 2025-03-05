import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { users } from './data';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface NotificationService {
  sendNotification(data: NotificationRequest): Observable<NotificationResponse>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private notificationService: NotificationService;

  constructor(
    @Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc,
    @Inject('RABBITMQ_SERVICE') private readonly clientRabbit: ClientProxy,
  ) {}

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

  getAll(): User[] {
    return users;
  }

  getById(idUser: string): User {
    const user = users.find((user) => user.id === idUser);
    if (!user) throw new NotFoundException();

    return user;
  }

  update({ id, data }: { id: string; data: UpdateUserDto }) {
    const user = this.getById(id);

    const updatedUser: UpdateUserDto = {
      ...data,
    };

    const indexOfUser = users.findIndex((user) => user.id === id);

    users[indexOfUser] = {
      ...user,
      ...updatedUser,
      id: user.id,
    };

    this.clientRabbit.emit('user.updated', {
      id: user.id,
      message: `User ${user.name} updated`,
      updateAt: new Date(),
    });

    return users[indexOfUser];
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
