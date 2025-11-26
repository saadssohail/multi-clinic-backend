import { Clinic, PrismaClient, Role, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const plainPassword: string = "12345"; // fixed password
  const hashedPassword: string = await bcrypt.hash(plainPassword, 10);
  const { faker } = await import("@faker-js/faker");  // ✅ dynamic import
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

  await prisma.speciality.createMany({
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
        password: hashedPassword,       // <--- ADDED
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

  // ---------- Doctors & Receptionists ----------
  for (const clinic of clinics) {
    for (let i = 0; i < faker.number.int({ min: 15, max: 20 }); i++) {
      const doctor = await prisma.user.create({
        data: {
          name: `Dr. ${faker.person.fullName()}`,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          isActive: true,
          role: Role.DOCTOR,
          password: hashedPassword,     // <--- ADDED
        },
      });

      const clinicDoctor = await prisma.clinicDoctor.create({
        data: { clinicId: clinic.id, doctorId: doctor.id },
      });

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

    for (let j = 0; j < 4; j++) {
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          isActive: true,
          role: Role.RECEPTIONIST,
          password: hashedPassword,     // <--- ADDED
        },
      });
    }
  }

  console.log(`👩‍⚕️ Populated doctors and receptionists`);

  // ---------- Patients ----------
  const patientsCount = 100;
  const patients: User[] = [];

  for (let i = 0; i < patientsCount; i++) {
    const patient = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        isActive: true,
        role: Role.PATIENT,
        password: hashedPassword,       // <--- ADDED
      },
    });
    patients.push(patient);
  }
  console.log(`🧍 Created ${patients.length} patients`);

  // ---------- Appointments, Bills, Payments ----------
  const allClinics = await prisma.clinic.findMany({ include: { doctors: true } });

  for (let i = 0; i < 200; i++) {
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

  console.log("💰 Appointments, bills, payments generated");

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
