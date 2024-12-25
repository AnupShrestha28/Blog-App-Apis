import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function seedSuperAdmin() {
  const username = process.env.SUPERADMIN_USERNAME || "superadmin";
  const email = process.env.SUPERADMIN_EMAIL || "superadmin@gmail.com";
  const password = process.env.SUPERADMIN_PASSWORD || "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Super Admin User seeded successfully.");
}

seedSuperAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
