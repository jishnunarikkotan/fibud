import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  expertId: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 