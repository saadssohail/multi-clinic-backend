import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateBillDto } from './dto/create-bill.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

@Controller('receptionist')
export class ReceptionistController {
  constructor(private readonly service: ReceptionistService) {}

  // -------------------- Clinics --------------------------
  @Get('clinics')
  getClinics() {
    return this.service.getClinics();
  }

  // ----------------- Doctors in Clinic -------------------
  @Get('clinics/:clinicId/doctors')
  getClinicDoctors(@Param('clinicId') clinicId: string) {
    return this.service.getClinicDoctors(clinicId);
  }

  // ---------------- Doctor Availability -------------------
  @Get('doctors/:doctorId/availability')
  getDoctorAvailability(@Param('doctorId') doctorId: string) {
    return this.service.getDoctorAvailability(doctorId);
  }

  // -------------------- Patients -------------------------
  @Get('patients')
  listPatients() {
    return this.service.listPatients();
  }

  // ------------------ Appointments ------------------------
  @Post('appointments')
  createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.service.createAppointment(dto);
  }

  @Get('appointments/pending')
  listPending() {
    return this.service.listPendingAppointments();
  }

  @Patch('appointments/:id/accept')
  acceptAppointment(@Param('id') id: string) {
    return this.service.acceptAppointment(id);
  }

  @Patch('appointments/:id/cancel')
  cancelAppointment(@Param('id') id: string) {
    return this.service.cancelAppointment(id);
  }

  @Patch('appointments/:id')
  updateAppointment(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.updateAppointment(id, dto);
  }

  // ---------------------- Billing -------------------------
  @Post('bills')
  createBill(@Body() dto: CreateBillDto) {
    return this.service.createBill(dto);
  }

  @Post('payments')
  recordPayment(@Body() dto: RecordPaymentDto) {
    return this.service.recordPayment(dto);
  }
}
