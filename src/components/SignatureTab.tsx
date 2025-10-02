import React, { useState, useEffect } from 'react';
import SignatureModal from './SignatureModal';
import apiService from '@/services/api';
import { format } from 'date-fns';

interface Signature {
  fileName: string;
  url: string;
  createdAt: string;
}

interface SignatureTabProps {
  patientId: number;
}

const SignatureTab: React.FC<SignatureTabProps> = ({ patientId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSignaturesByPatient(patientId);
      if (response.success && response.data) {
        setSignatures(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchSignatures();
    }
  }, [patientId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSignature = async (signatureData: string | File) => {
    try {
      const type = typeof signatureData === 'string' ? 'digital' : 'pdf';
      const response = await apiService.uploadSignature(patientId, signatureData, type);
      if (response.success) {
        alert('Assinatura salva com sucesso!');
        fetchSignatures(); // Refetch signatures after saving
      } else {
        alert(`Erro ao salvar assinatura: ${response.message}`);
      }
    } catch (error) {
      alert(`Erro ao salvar assinatura: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-6 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Assinaturas do Paciente</h3>
        <button
          onClick={handleOpenModal}
          className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
        >
          Coletar Assinatura
        </button>
      </div>

      {loading && <p>Carregando assinaturas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {signatures.length > 0 ? (
            signatures.map((sig) => (
              <a 
                key={sig.fileName} 
                href={`http://localhost:3001${sig.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out group"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                  {sig.fileName.endsWith('.pdf') ? (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="mt-2 text-sm">PDF</span>
                    </div>
                  ) : (
                    <img 
                      src={`http://localhost:3001${sig.url}`} 
                      alt="Assinatura" 
                      className="w-full h-full object-contain p-2 bg-white group-hover:opacity-90 transition-opacity duration-300"
                    />
                  )}
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs text-gray-500 truncate">
                    Coletada em:
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {format(new Date(sig.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhuma assinatura coletada ainda.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <SignatureModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSignature}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default SignatureTab;
