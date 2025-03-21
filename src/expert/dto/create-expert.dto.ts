import { IsString, IsNotEmpty, IsEmail, IsNumber, Min } from 'class-validator';

export class CreateExpertDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsNumber()
  @Min(0)
  hourlyRate: number;
} 