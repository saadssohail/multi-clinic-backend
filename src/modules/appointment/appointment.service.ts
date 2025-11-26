import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Doctor appointments
  async getDoctorAppointments(doctorId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { startTime: 'asc' },
      include: {
        patient: true,
        clinic: true,
      },
    });

    return appointments.map((a) => ({
      id: a.id,
      patientName: a.patient.name,
      clinicName: a.clinic.name,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      notes: a.notes,
      priority: a.priority,
    }));
  }

  // Patient appointments
  async getPatientAppointments(patientId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startTime: 'asc' },
      include: {
        doctor: true,
        clinic: true,
      },
    });

    return appointments.map((a) => ({
      id: a.id,
      doctorName: a.doctor.name,
      clinicName: a.clinic.name,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      notes: a.notes,
      priority: a.priority,
    }));
  }

  // All appointments (admin or receptionist)
  async getAllAppointments() {
    return this.prisma.appointment.findMany({
      orderBy: { startTime: 'asc' },
      include: {
        doctor: true,
        patient: true,
        clinic: true,
      },
    });
  }
}
