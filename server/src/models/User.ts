import { executeQuery, executeQuerySingle } from '@/config/database';
import { User, UserResponse } from '@/types';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, name, email, role, crm, phone, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `;
    return executeQuerySingle<UserResponse>(query, [id]);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT * FROM users WHERE email = ?
    `;
    return executeQuerySingle<User>(query, [email]);
  }

  static async findAll(limit = 50, offset = 0): Promise<UserResponse[]> {
    const query = `
      SELECT id, name, email, role, crm, phone, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    return executeQuery<UserResponse>(query, [limit, offset]);
  }

  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const query = `
      INSERT INTO users (name, email, password, role, crm, phone) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result: any = await executeQuery(query, [
      userData.name,
      userData.email,
      hashedPassword,
      userData.role,
      userData.crm || null,
      userData.phone || null
    ]);
    
    return result.insertId;
  }

  static async update(id: number, userData: Partial<User>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    if (userData.password) {
      fields.push('password = ?');
      values.push(await bcrypt.hash(userData.password, 12));
    }
    
    if (userData.role) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    if (userData.crm !== undefined) {
      fields.push('crm = ?');
      values.push(userData.crm);
    }
    
    if (userData.phone !== undefined) {
      fields.push('phone = ?');
      values.push(userData.phone);
    }

    if (fields.length === 0) return false;

    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await executeQuery(query, values);
    
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM users WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM users`;
    const result = await executeQuerySingle<{count: number}>(query);
    return result?.count || 0;
  }

  static async findByRole(role: string): Promise<UserResponse[]> {
    const query = `
      SELECT id, name, email, role, crm, phone, created_at, updated_at 
      FROM users 
      WHERE role = ? 
      ORDER BY name
    `;
    return executeQuery<UserResponse>(query, [role]);
  }
}