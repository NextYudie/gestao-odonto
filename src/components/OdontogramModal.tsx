import React, { useState, useEffect } from 'react';
import OdontogramChart from './OdontogramChart';
import ToothStatusPopover from './ToothStatusPopover';

const OdontogramModal = ({ isOpen, onClose, onSubmit, patientId }) => {
  const [chartData, setChartData] = useState({});
  const [selectedTooth, setSelectedTooth] = useState<{ toothNumber: number, section: string } | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setChartData({});
      setSelectedTooth(null);
    }
  }, [isOpen]);

  const handleToothClick = (toothNumber: number, section: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedTooth({ toothNumber, section });
    setPopoverPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  const handleStatusSelect = (status: string) => {
    if (selectedTooth) {
      setChartData(prev => ({
        ...prev,
        [selectedTooth.toothNumber]: {
          ...prev[selectedTooth.toothNumber],
          [selectedTooth.section]: status,
        },
      }));
    }
    setSelectedTooth(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      patient_id: patientId,
      chart_type: 'inicial',
      chart_data: chartData,
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-full h-full overflow-auto mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Novo Odontograma</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OdontogramChart chartData={chartData} onToothClick={handleToothClick} selectedTooth={selectedTooth} />
          </div>

          {selectedTooth && (
            <ToothStatusPopover
              position={popoverPosition}
              onSelect={handleStatusSelect}
              onClose={() => setSelectedTooth(null)}
              toothNumber={selectedTooth.toothNumber}
              section={selectedTooth.section}
            />
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OdontogramModal;