import React, { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import TransactionModal from '@/components/TransactionModal';
import apiService from '@/services/api';
import type { Transaction } from '@/types/Transaction';

const FinanceiroPage: React.FC = () => {
  const [summary, setSummary] = useState({ monthlyRevenue: 0, monthlyExpenses: 0, monthlyProfit: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, transactionsRes] = await Promise.all([
        apiService.getFinancialSummary(),
        apiService.getTransactions(),
      ]);

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      } else {
        setError(summaryRes.message);
      }

      if (transactionsRes.success && transactionsRes.data) {
        setTransactions(transactionsRes.data);
      } else {
        setError(transactionsRes.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTransaction = async (transaction: any) => {
    try {
      const response = await apiService.createTransaction(transaction);
      if (response.success) {
        fetchData(); // Refresh data
      } else {
        alert(`Erro ao criar transação: ${response.message}`);
      }
    } catch (error) {
      alert(`Erro ao criar transação: ${(error as Error).message}`);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestão Financeira</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
        >
          Adicionar Transação
        </button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard title="Receita do Mês" value={formatCurrency(summary.monthlyRevenue)} />
            <StatCard title="Despesas do Mês" value={formatCurrency(summary.monthlyExpenses)} />
            <StatCard title="Lucro do Mês" value={formatCurrency(summary.monthlyProfit)} />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Transações Recentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tx.type === 'revenue' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`py-4 px-6 whitespace-nowrap text-sm text-right font-medium ${tx.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default FinanceiroPage;
