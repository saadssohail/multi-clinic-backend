import { Module } from '@nestjs/common';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ReceptionistController],
  providers: [ReceptionistService, PrismaService],
})
export class ReceptionistModule {}
