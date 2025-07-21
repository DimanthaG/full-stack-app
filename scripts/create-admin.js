require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = {
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date()
  };

  try {
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const result = await db.collection('users').insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser(); 