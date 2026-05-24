import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@evainteriors.ae" },
    update: {},
    create: {
      email: "admin@evainteriors.ae",
      name: "EVA Sales Team",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("Password: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
