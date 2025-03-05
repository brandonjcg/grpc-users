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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import {
  NotificationRequest,
  NotificationResponse,
} from './interfaces/notification.interface';
import { User } from './entities/user.entity';
import { CreateUserDto, NotifyUserDto, UpdateUserDto } from './dto/user.dto';

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
    @Query() params: NotifyUserDto,
  ): Promise<NotificationResponse> {
    const notificationRequest: NotificationRequest = {
      id,
      message: params.message,
    };

    const response = await firstValueFrom(
      this.userService.sendNotification({ ...notificationRequest }),
    );

    return response;
  }

  @ApiOperation({
    summary: 'Get a user by id',
    description: 'Retrieve a user by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @Get(':id')
  getUserById(@Param('id') id: string): User {
    const user = this.userService.getById(id);

    return user;
  }

  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  getUsers(): User[] {
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
