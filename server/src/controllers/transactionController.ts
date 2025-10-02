import { Request, Response } from 'express';
import { executeQuery, executeQuerySingle } from '@/config/database';
import { Transaction } from '@/models/Transaction';

export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const transactions = await executeQuery<Transaction>('SELECT * FROM transactions');
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);

    const monthlyRevenue = monthlyTransactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyProfit = monthlyRevenue - monthlyExpenses;

    res.status(200).json({ 
      success: true, 
      data: { monthlyRevenue, monthlyExpenses, monthlyProfit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await executeQuery<Transaction>('SELECT * FROM transactions ORDER BY date DESC');
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { date, description, type, amount } = req.body;

    if (!date || !description || !type || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const query = 'INSERT INTO transactions (date, description, type, amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
    const now = new Date().toISOString();
    const params = [date, description, type, amount, now, now];

    const result = await executeQuerySingle(query, params);

    res.status(201).json({ success: true, message: 'Transaction created successfully', data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
