import { IsString, IsEmail, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string; // unique identifier

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  adminId!: string;
}
