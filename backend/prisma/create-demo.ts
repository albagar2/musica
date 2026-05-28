import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@soundwave.com';
  const password = await bcrypt.hash('demo123', 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        password,
        role: 'USER',
      },
    });
    console.log('✅ Usuario demo creado: demo@soundwave.com / demo123');
  } else {
    console.log('ℹ️ El usuario demo ya existe.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
