import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): string {
    return 'List of all clinics';
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }
}
