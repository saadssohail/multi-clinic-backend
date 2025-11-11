import { Clinic, Patient, PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // ---------- Specialities ----------
  const specialityNames = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "ENT",
    "Gynecology",
    "Psychiatry",
    "Dentistry",
    "General Medicine",
  ];

  const specialities = await prisma.speciality.createMany({
    data: specialityNames.map((name) => ({ name })),
  });

  const specialityList = await prisma.speciality.findMany();
  console.log(`✅ Created ${specialityList.length} specialities`);

  // ---------- Clinics ----------
  const clinicCount = 25;
  const clinics: Clinic[] = [];

  for (let i = 0; i < clinicCount; i++) {
    const admin = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        isActive: true,
        role: Role.CLINIC_ADMIN,
      },
    });

    const clinic = await prisma.clinic.create({
      data: {
        name: `${faker.location.city()} Health Center`,
        code: faker.string.alpha(6).toUpperCase(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        adminId: admin.id,
      },
    });

    // Assign random specialities to the clinic
    const assignedSpecs = faker.helpers.arrayElements(
      specialityList,
      faker.number.int({ min: 3, max: 6 })
    );
    for (const spec of assignedSpecs) {
      await prisma.clinicSpeciality.create({
        data: { clinicId: clinic.id, specialityId: spec.id },
      });
    }

    clinics.push(clinic);
  }
  console.log(`🏥 Created ${clinics.length} clinics`);

  // ---------- Doctors, Receptionists, and Staff ----------
  for (const clinic of clinics) {
    // 5–10 doctors per clinic
    for (let i = 0; i < faker.number.int({ min: 15, max: 20 }); i++) {
      const doctor = await prisma.user.create({
        data: {
          name: `Dr. ${faker.person.fullName()}`,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          isActive: true,
          role: Role.DOCTOR,
        },
      });

      const clinicDoctor = await prisma.clinicDoctor.create({
        data: { clinicId: clinic.id, doctorId: doctor.id },
      });

      // Assign 1–3 specialities
      const specs = faker.helpers.arrayElements(
        specialityList,
        faker.number.int({ min: 1, max: 3 })
      );
      for (const spec of specs) {
        await prisma.clinicDoctorSpeciality.create({
          data: {
            clinicDoctorId: clinicDoctor.id,
            specialityId: spec.id,
          },
        });
      }
    }

    // 2 receptionists per clinic
    for (let j = 0; j < 4; j++) {
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          isActive: true,
          role: Role.RECEPTIONIST,
        },
      });
    }
  }

  console.log(`👩‍⚕️ Populated doctors and receptionists for all clinics`);

  // ---------- Patients ----------
  const patientsCount = 2000;
  const patients: Patient[] = [];
  for (let i = 0; i < patientsCount; i++) {
    const patient = await prisma.patient.create({
      data: {
        fullName: faker.person.fullName(),
        gender: faker.person.sexType(),
        dob: faker.date.birthdate({ min: 1950, max: 2020, mode: "year" }),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
    });
    patients.push(patient);
  }
  console.log(`🧍 Created ${patients.length} patients`);

  // ---------- Appointments, Bills & Payments ----------
  const allClinics = await prisma.clinic.findMany({ include: { doctors: true } });
  const allDoctors = await prisma.user.findMany({ where: { role: Role.DOCTOR } });

  for (let i = 0; i < 5000; i++) {
    const clinic = faker.helpers.arrayElement(allClinics);
    const doctorLink = faker.helpers.arrayElement(clinic.doctors);
    if (!doctorLink) continue;

    const doctorId = doctorLink.doctorId;
    const patient = faker.helpers.arrayElement(patients);

    const appointment = await prisma.appointment.create({
      data: {
        clinicId: clinic.id,
        doctorId,
        patientId: patient.id,
        startTime: faker.date.future(),
        endTime: faker.date.future(),
        status: faker.helpers.arrayElement(["SCHEDULED", "COMPLETED", "CANCELLED"]),
        priority: faker.helpers.arrayElement(["HIGH", "MEDIUM", "LOW"]),
        notes: faker.lorem.sentence(),
      },
    });

    // Bill
    const totalAmount = faker.number.float({ min: 2000, max: 10000 });
    const bill = await prisma.bill.create({
      data: {
        appointmentId: appointment.id,
        totalAmount,
        discount: faker.number.float({ min: 0, max: 500 }),
        status: faker.helpers.arrayElement(["PAID", "UNPAID"]),
        patientId: patient.id,
      },
    });

    // Payment if paid
    if (bill.status === "PAID") {
      await prisma.payment.create({
        data: {
          billId: bill.id,
          amount: bill.totalAmount - (bill.discount ?? 0),
          method: faker.helpers.arrayElement(["CASH", "CARD", "ONLINE"]),
        },
      });
    }
  }

  console.log("💰 Appointments, bills, and payments generated");

  // ---------- Reports ----------
  for (const clinic of clinics) {
    await prisma.report.create({
      data: {
        clinicId: clinic.id,
        type: "DAILY_SUMMARY",
        data: {
          totalAppointments: faker.number.int({ min: 50, max: 1000 }),
          totalRevenue: faker.number.float({ min: 50000, max: 500000 }),
        },
      },
    });
  }

  console.log("📊 Reports generated");
  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
