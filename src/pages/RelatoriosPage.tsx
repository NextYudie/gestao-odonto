import React, { useState } from 'react';

const RelatoriosPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-600">Visualize estatísticas e relatórios da clínica</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="1year">Último ano</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-download mr-2"></i>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Consultas por Especialidade</h2>
          <div className="space-y-3">
            {[
              { specialty: 'Cardiologia', count: 45, percentage: 35 },
              { specialty: 'Ortopedia', count: 32, percentage: 25 },
              { specialty: 'Pediatria', count: 28, percentage: 22 },
              { specialty: 'Dermatologia', count: 23, percentage: 18 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.specialty}</span>
                  <span className="text-sm text-gray-600">{item.count} consultas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Faturamento Mensal</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Receita Total</span>
              <span className="font-bold text-green-600">R$ 45.230,00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Custos Operacionais</span>
              <span className="font-bold text-red-600">R$ 12.450,00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <span className="font-medium">Lucro Líquido</span>
              <span className="font-bold text-blue-600">R$ 32.780,00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Taxa de Ocupação</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
            <p className="text-sm text-gray-600">Média do período</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Satisfação</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
            <p className="text-sm text-gray-600">Avaliação média</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Cancelamentos</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">8%</div>
            <p className="text-sm text-gray-600">Taxa de cancelamento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;