import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entity/users.entity';
import { FacultyEnum } from '../enum/faculty.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Georgia'})
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'user', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'CITEC', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(FacultyEnum)
  faculty?: FacultyEnum;
}
