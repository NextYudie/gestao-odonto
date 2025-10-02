import React, { useState } from 'react';
import SignaturePad from './SignaturePad';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string | File) => void;
  patientId: number;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, patientId }) => {
  const [activeTab, setActiveTab] = useState('digital');
  const [signature, setSignature] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSave = () => {
    if (activeTab === 'digital' && signature) {
      onSave(signature);
    } else if (activeTab === 'pdf' && pdfFile) {
      onSave(pdfFile);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Coletar Assinatura</h3>

          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('digital')}
                className={`${
                  activeTab === 'digital'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Assinatura Digital
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`${
                  activeTab === 'pdf'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Upload de PDF
              </button>
            </nav>
          </div>

          <div className="mt-2 px-7 py-3">
            {activeTab === 'digital' && (
              <SignaturePad onEnd={(sig) => setSignature(sig)} />
            )}
            {activeTab === 'pdf' && (
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input id="pdf-upload" type="file" className="hidden" accept=".pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} />
                </label>
                {pdfFile && <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: {pdfFile.name}</p>}
              </div>
            )}
          </div>

          <div className="items-center px-4 py-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Salvar Assinatura
            </button>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
