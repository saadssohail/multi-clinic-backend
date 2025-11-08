import { Injectable } from '@nestjs/common';

@Injectable()
export class ClinicService {
  findAll(): string {
    return 'List of all clinics';
  }
}
