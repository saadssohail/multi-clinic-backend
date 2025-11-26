import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateBillDto } from './dto/create-bill.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

@Injectable()
export class ReceptionistService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------- Clinics --------------------------
  async getClinics() {
    return this.prisma.clinic.findMany({
      select: { id: true, name: true },
    });
  }

  // ------------------ Clinic → Doctors -------------------
  async getClinicDoctors(clinicId: string) {
    return this.prisma.clinicDoctor.findMany({
      where: { clinicId },
      select: {
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // -------------------- Doctor Availability ---------------
  async getDoctorAvailability(doctorId: string) {
    return this.prisma.staffSchedule.findMany({
      where: { userId: doctorId },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  // -------------------- Patients --------------------------
  async listPatients() {
    return this.prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: { id: true, name: true, email: true },
    });
  }

  // ------------------ Create Appointment -------------------
  async createAppointment(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        clinicId: dto.clinicId,
        doctorId: dto.doctorId,
        patientId: dto.patientId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        notes: dto.notes || '',
        status: 'SCHEDULED',
      },
    });
  }

  // ------------------ Pending Appointments ----------------
  async listPendingAppointments() {
    return this.prisma.appointment.findMany({
      where: { status: 'SCHEDULED' },
      include: { patient: true },
      orderBy: { startTime: 'asc' },
    });
  }

  // -------------------- Accept ----------------------------
  async acceptAppointment(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });
  }

  // -------------------- Cancel ----------------------------
  async cancelAppointment(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  // -------------------- Update ----------------------------
  async updateAppointment(id: string, dto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        notes: dto.notes ?? undefined,
      },
    });
  }

  // -------------------- Billing ---------------------------
  async createBill(dto: CreateBillDto) {
    return this.prisma.bill.create({ data: dto });
  }

  async recordPayment(dto: RecordPaymentDto) {
    return this.prisma.payment.create({ data: dto });
  }
}
