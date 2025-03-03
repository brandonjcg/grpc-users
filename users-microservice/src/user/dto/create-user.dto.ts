import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

// TODO: missing ad decorators for OpenAPI
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  age: number;
}
