-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SYSTEM_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speciality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSpeciality" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,

    CONSTRAINT "ClinicSpeciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicDoctor" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "ClinicDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicDoctorSpeciality" (
    "id" TEXT NOT NULL,
    "clinicDoctorId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,

    CONSTRAINT "ClinicDoctorSpeciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_code_key" ON "Clinic"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "Speciality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSpeciality_clinicId_specialityId_key" ON "ClinicSpeciality"("clinicId", "specialityId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDoctor_clinicId_doctorId_key" ON "ClinicDoctor"("clinicId", "doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDoctorSpeciality_clinicDoctorId_specialityId_key" ON "ClinicDoctorSpeciality"("clinicDoctorId", "specialityId");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpeciality" ADD CONSTRAINT "ClinicSpeciality_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpeciality" ADD CONSTRAINT "ClinicSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctor" ADD CONSTRAINT "ClinicDoctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctor" ADD CONSTRAINT "ClinicDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctorSpeciality" ADD CONSTRAINT "ClinicDoctorSpeciality_clinicDoctorId_fkey" FOREIGN KEY ("clinicDoctorId") REFERENCES "ClinicDoctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctorSpeciality" ADD CONSTRAINT "ClinicDoctorSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
