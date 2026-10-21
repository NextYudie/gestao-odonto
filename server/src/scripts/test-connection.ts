import { config } from 'dotenv';
import { createConnection, executeQuery } from '../config/database';

config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`User: ${process.env.DB_USER}`);
  
  try {
    await createConnection();
    console.log('✅ Database connection successful!');
    
    const rows = await executeQuery<{ version: string }>('SELECT VERSION() as version');
    console.log('📊 MySQL version:', rows[0]?.version);
    
    const tables = await executeQuery('SHOW TABLES');
    console.log('📋 Tables found:', tables.length);
    
    console.log('🔒 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();