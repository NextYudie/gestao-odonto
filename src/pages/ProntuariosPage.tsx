import React from 'react';

const ProntuariosPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prontuários</h1>
        <p className="text-gray-600">Acesse e gerencie prontuários médicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total de Prontuários</p>
              <p className="text-3xl font-bold">1,247</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <i className="fas fa-file-medical text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Prontuários Ativos</p>
              <p className="text-3xl font-bold">984</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Atualizados Hoje</p>
              <p className="text-3xl font-bold">23</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="fas fa-calendar-day text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Prontuários Recentes</h2>
          <div className="flex space-x-2">
            <input
              type="search"
              placeholder="Buscar prontuário..."
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { patient: 'Maria Silva', date: '20/11/2024', doctor: 'Dr. Silva', specialty: 'Cardiologia' },
            { patient: 'João Santos', date: '19/11/2024', doctor: 'Dra. Santos', specialty: 'Ortopedia' },
            { patient: 'Ana Costa', date: '18/11/2024', doctor: 'Dr. Lima', specialty: 'Pediatria' },
            { patient: 'Pedro Oliveira', date: '17/11/2024', doctor: 'Dr. Silva', specialty: 'Cardiologia' }
          ].map((record, index) => (
            <div key={index} className="patient-record p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{record.patient}</h3>
                  <p className="text-sm text-gray-600">
                    {record.specialty} - {record.doctor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{record.date}</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    <i className="fas fa-eye mr-1"></i>
                    Visualizar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProntuariosPage;