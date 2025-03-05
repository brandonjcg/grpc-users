import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  age: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id: string;
}

export class NotifyUserDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
