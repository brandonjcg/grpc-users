import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
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

  @ApiOperation({
    summary: 'Notify a user',
    description:
      'Send a notification to a user through notification microservice',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
  })
  @Get(':id/notify')
  async notifyUser(
    @Param('id') id: string,
    @Query('message') message: string,
  ): Promise<NotificationResponse> {
    const notificationRequest: NotificationRequest = {
      id,
      message,
    };

    const response = await firstValueFrom(
      this.userService.sendNotification({ ...notificationRequest }),
    );

    return response;
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
