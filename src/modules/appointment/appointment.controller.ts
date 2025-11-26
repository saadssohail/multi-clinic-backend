import { Controller, Get, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // Doctor's appointments
  @Get('doctor/:doctorId')
  async getDoctorAppointments(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getDoctorAppointments(doctorId);
  }

  // Patient's appointments (optional future use)
  @Get('patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string) {
    return this.appointmentService.getPatientAppointments(patientId);
  }

  // All appointments (admin)
  @Get()
  async getAll() {
    return this.appointmentService.getAllAppointments();
  }
}
