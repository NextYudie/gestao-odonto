import React, { useState, useEffect } from 'react';
import apiService from '@/services/api';
import { format } from 'date-fns';
import AnamneseModal from '@/components/AnamneseModal';
import OdontogramModal from '@/components/OdontogramModal';
import OdontogramChart from '@/components/OdontogramChart'; // Import OdontogramChart

interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  birth_date: string;
  cpf: string;
  address?: string;
  emergency_contact?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface Anamnese {
  id: number;
  patient_id: number;
  chief_complaint?: string;
  history_of_present_illness?: string;
  allergies?: any;
  systemic_diseases?: any;
  medications_in_use?: string;
  oral_hygiene_habits?: string;
  created_at: string;
}

interface Odontogram {
  id: number;
  patient_id: number;
  chart_data: any; // JSON type in DB, so 'any' for flexibility
  chart_type: 'inicial' | 'plano_tratamento';
  created_at: string; // Date in backend, string when fetched
}

const ProntuariosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [odontograms, setOdontograms] = useState<Odontogram[]>([]); // New state for odontograms
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnamneseModalOpen, setIsAnamneseModalOpen] = useState(false);
  const [isOdontogramModalOpen, setIsOdontogramModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('anamneses'); // New state for active tab

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPatients();
        if (response.success && response.data) {
          setPatients(response.data.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    fetchAnamneses(patient.id);
    fetchOdontograms(patient.id); // Fetch odontograms when patient is selected
  };

  const fetchAnamneses = async (patientId: number) => {
    try {
      setError(null);
      const response = await apiService.getAnamnesesByPatient(patientId);
      if (response.success && response.data) {
        setAnamneses(response.data);
      } else {
        setAnamneses([]);
        setError(response.message);
      }
    } catch (err) {
      setError((err as Error).message);
      setAnamneses([]);
    }
  };

  const fetchOdontograms = async (patientId: number) => {
    try {
      setError(null);
      const response = await apiService.getOdontogramsByPatient(patientId);
      if (response.success && response.data) {
        const parsedOdontograms = response.data.map(odontogram => {
          try {
            return {
              ...odontogram,
              chart_data: typeof odontogram.chart_data === 'string' 
                ? JSON.parse(odontogram.chart_data) 
                : odontogram.chart_data,
            };
          } catch (e) {
            console.error('Failed to parse chart_data:', e);
            return {
              ...odontogram,
              chart_data: {},
            };
          }
        });
        setOdontograms(parsedOdontograms);
      } else {
        setOdontograms([]);
        setError(response.message);
      }
    } catch (err) {
      setError((err as Error).message);
      setOdontograms([]);
    }
  };

  const handleAnamneseModalOpen = () => {
    if (selectedPatient) {
      setIsAnamneseModalOpen(true);
    }
  };

  const handleAnamneseModalClose = () => {
    setIsAnamneseModalOpen(false);
  };

  const handleOdontogramModalOpen = () => {
    if (selectedPatient) {
      setIsOdontogramModalOpen(true);
    }
  };

  const handleOdontogramModalClose = () => {
    setIsOdontogramModalOpen(false);
  };

  const handleAnamneseSubmit = async (anamneseData: any) => {
    if (!selectedPatient) return;

    try {
      const response = await apiService.createAnamnese(anamneseData);
      if (response.success) {
        handleAnamneseModalClose();
        fetchAnamneses(selectedPatient.id);
      } else {
        alert(`Erro ao criar anamnese: ${response.message}`);
      }
    } catch (error) {
      alert(`Erro ao criar anamnese: ${(error as Error).message}`);
    }
  };

  const handleOdontogramSubmit = async (odontogramData: any) => {
    if (!selectedPatient) return;

    try {
      const response = await apiService.createOdontogram(odontogramData);
      if (response.success) {
        handleOdontogramModalClose();
        fetchOdontograms(selectedPatient.id);
      } else {
        alert(`Erro ao criar odontograma: ${response.message}`);
      }
    } catch (error) {
      alert(`Erro ao criar odontograma: ${(error as Error).message}`);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Prontuários</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <ul className="space-y-2 h-96 overflow-y-auto">
            {filteredPatients.map(p => (
              <li
                key={p.id}
                onClick={() => handlePatientSelect(p)}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedPatient?.id === p.id ? 'bg-amber-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Patient Details */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          {selectedPatient ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                  <p className="text-gray-600">Nascimento: {selectedPatient.birth_date && !isNaN(new Date(selectedPatient.birth_date).getTime()) ? format(new Date(selectedPatient.birth_date), 'dd/MM/yyyy') : 'Data Inválida'}</p>
                  <p className="text-gray-600">CPF: {selectedPatient.cpf}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('anamneses')}
                    className={`${
                      activeTab === 'anamneses'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Anamneses
                  </button>
                  <button
                    onClick={() => setActiveTab('odontograms')}
                    className={`${
                      activeTab === 'odontograms'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Odontograma
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'anamneses' && (
                  <>
                    <div className="flex justify-between items-center mt-6 mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Histórico de Anamneses</h3>
                      <button 
                        onClick={handleAnamneseModalOpen}
                        className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
                      >
                        Nova Anamnese
                      </button>
                    </div>
                    <div className="space-y-4">
                      {anamneses.length > 0 ? (
                        anamneses.map((anamnese) => (
                          <div key={anamnese.id} className="p-4 border rounded-md bg-gray-50">
                            <h4 className="font-bold text-lg mb-2">
                              Anamnese de {anamnese.created_at && !isNaN(new Date(anamnese.created_at).getTime()) ? format(new Date(anamnese.created_at), 'dd/MM/yyyy') : 'Data Indisponível'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><strong>Queixa Principal:</strong></p>
                                <p>{anamnese.chief_complaint || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>História da Doença Atual:</strong></p>
                                <p>{anamnese.history_of_present_illness || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Alergias:</strong></p>
                                <p>{anamnese.allergies || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Doenças Sistêmicas:</strong></p>
                                <p>{anamnese.systemic_diseases || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Medicamentos em Uso:</strong></p>
                                <p>{anamnese.medications_in_use || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Hábitos de Higiene Oral:</strong></p>
                                <p>{anamnese.oral_hygiene_habits || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Nenhum registro de anamnese para este paciente.</p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'odontograms' && (
                  <div>
                    <div className="flex justify-between items-center mt-6 mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Histórico de Odontogramas</h3>
                      <button 
                        onClick={handleOdontogramModalOpen}
                        className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
                      >
                        Novo Odontograma
                      </button>
                    </div>
                    {odontograms.length > 0 ? (
                      odontograms.map((odontogram) => (
                        <div key={odontogram.id} className="p-4 border rounded-md bg-gray-50 mb-4">
                          <h4 className="font-bold text-lg mb-2">
                            Odontograma ({odontogram.chart_type}) de {odontogram.created_at && !isNaN(new Date(odontogram.created_at).getTime()) ? format(new Date(odontogram.created_at), 'dd/MM/yyyy') : 'Data Indisponível'}
                          </h4>
                          <OdontogramChart chartData={odontogram.chart_data} onToothClick={(toothNumber) => alert(`Clicou no dente: ${toothNumber}`)} />
                        </div>
                      ))
                    ) : (
                      <p>Nenhum odontograma registrado para este paciente.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Selecione um paciente para ver os detalhes.</p>
            </div>
          )}
        </div>
      </div>

      {isAnamneseModalOpen && selectedPatient && (
        <AnamneseModal
          isOpen={isAnamneseModalOpen}
          onClose={handleAnamneseModalClose}
          onSubmit={handleAnamneseSubmit}
          patientId={selectedPatient.id}
        />
      )}

      {isOdontogramModalOpen && selectedPatient && (
        <OdontogramModal
          isOpen={isOdontogramModalOpen}
          onClose={handleOdontogramModalClose}
          onSubmit={handleOdontogramSubmit}
          patientId={selectedPatient.id}
        />
      )}
    </div>
  );
};

export default ProntuariosPage;