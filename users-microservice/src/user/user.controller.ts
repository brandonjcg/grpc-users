import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  getUsers() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update({ id, data });
  }
}
