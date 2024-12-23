import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); 

const prisma = new PrismaClient();

async function seedSuperAdmin() {
  const username = "superadmin";
  const email = "superadmin@gmail.com";
  const password = "admin123";

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create Super Admin User
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
