import { config } from 'dotenv';
import { createConnection } from '../config/database';

config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`User: ${process.env.DB_USER}`);
  
  try {
    const connection = await createConnection();
    console.log('✅ Database connection successful!');
    
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL version:', (rows as any)[0].version);
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables found:', (tables as any).length);
    
    connection.end();
    console.log('🔒 Connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();