const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const user = await prisma.user.upsert({
      where: { email: 'adm@ilhame.id' },
      update: {
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        is_active: true,
      },
      create: {
        email: 'adm@ilhame.id',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        is_active: true,
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
