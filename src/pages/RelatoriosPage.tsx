import React, { useState, useEffect } from 'react';
import apiService from '@/services/api';

const RelatoriosPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');
  const [reportsData, setReportsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getReports(selectedPeriod);
        if (response.success && response.data) {
          setReportsData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const specialtyData = reportsData?.appointmentsBySpecialty ? 
    Object.entries(reportsData.appointmentsBySpecialty).map(([specialty, count]) => ({ specialty, count })) : [];
  const totalSpecialtyCount = specialtyData.reduce((sum, item) => sum + (item.count as number), 0);

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

      {loading && <p>Gerando relatórios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reportsData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Consultas por Especialidade</h2>
              <div className="space-y-3">
                {specialtyData.length > 0 ? specialtyData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.specialty}</span>
                      <span className="text-sm text-gray-600">{item.count} consultas</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${totalSpecialtyCount > 0 ? ((item.count as number) / totalSpecialtyCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                )) : <p className="text-gray-500">Nenhum dado de consulta para o período.</p>}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Faturamento Mensal</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Receita Total</span>
                  <span className="font-bold text-green-600">{formatCurrency(reportsData.financialReport.revenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Custos Operacionais</span>
                  <span className="font-bold text-red-600">{formatCurrency(reportsData.financialReport.expenses)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <span className="font-medium">Lucro Líquido</span>
                  <span className="font-bold text-amber-600">{formatCurrency(reportsData.financialReport.profit)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Novos Pacientes</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">{reportsData.newPatientsCount}</div>
                <p className="text-sm text-gray-600">No período</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Cancelamentos</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{reportsData.cancellationRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-600">Taxa de cancelamento</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RelatoriosPage;