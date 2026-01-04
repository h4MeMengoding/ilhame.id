const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'hi@ilhame.id';
    const password = 'Akusayangkamu17_';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User with email', email, 'already exists!');
      console.log('Deleting existing user and recreating...');
      await prisma.user.delete({
        where: { email },
      });
    }

    // Hash password with proper salt rounds
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Ilham Shofa',
        role: 'admin',
        is_active: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('ID:', adminUser.id);
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('Active:', adminUser.is_active);
    console.log('-----------------------------------');
    console.log('You can now login with:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('-----------------------------------');

    // Test password verification
    const isValid = await bcrypt.compare(password, adminUser.password);
    console.log('Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
