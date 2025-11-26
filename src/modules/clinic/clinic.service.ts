import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  // ✔ Return real clinics
  findAll() {
    return this.prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
