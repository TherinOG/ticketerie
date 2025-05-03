import prisma from "../../src/app/lib/prisma";
import bcrypt from 'bcrypt';

async function createAdmins() {
  const admins = [
    {
      email: 'admin1@example.com',
      password: 'admin123',
    },
    {
      email: 'admin2@example.com',
      password: 'admin456',
    },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        password: hashedPassword,
      },
    });
    console.log(`Administrateur ${admin.email} créé ou déjà existant`);
  }

  return true;
}

async function main() {
  try {
    console.log('Initialisation des administrateurs...');
    const success = await createAdmins();
    if (!success) {
      throw new Error("Impossible de créer les administrateurs");
    }
    console.log('Administrateurs créés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'exécution :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();