import React, { useState } from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ date, description, type, amount });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Transação</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
              <input 
                type="date" 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
              <input 
                type="text" 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select 
                id="type" 
                value={type} 
                onChange={(e) => setType(e.target.value as 'revenue' | 'expense')} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="revenue">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor</label>
              <input 
                type="number" 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value))} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                step="0.01"
              />
            </div>
          </div>

          <div className="items-center px-4 py-3 mt-4 text-right">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
