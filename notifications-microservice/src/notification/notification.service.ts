import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IGetUserByIdResponse } from './interfaces';

interface UserService {
  GetUserById(data: { id: string }): Observable<IGetUserByIdResponse>;
}

@Injectable()
export class NotificationService implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async getDataOfUserById(id: string) {
    const response = await firstValueFrom(this.userService.GetUserById({ id }));

    return response;
  }
}
