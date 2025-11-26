import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

// Custom type for patients list (matches SELECT)
type TPatientListItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔍 Used for authentication
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // 🧑 Create new user
  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }

  // 📌 Get all users
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 👨‍⚕️ Fetch ONLY PATIENT users (FIXED)
  async findAllPatients(): Promise<TPatientListItem[]> {
    return this.prisma.user.findMany({
      where: { role: 'PATIENT' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  // 📌 Get single user by ID
  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // ✏️ Update user
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  // ❌ Delete user
  async delete(id: string): Promise<void> {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
  }
}
