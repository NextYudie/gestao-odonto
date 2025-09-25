import { useState, useEffect } from 'react';

const OdontogramModal = ({ isOpen, onClose, onSubmit, patientId }) => {
  const [formData, setFormData] = useState({
    patient_id: patientId,
    chart_type: 'inicial', // Default to 'inicial'
    chart_data: '{}', // Default to empty JSON object string
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patient_id: patientId,
        chart_type: 'inicial',
        chart_data: '{}',
      });
    }
  }, [isOpen, patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let chart_data = {};
    if (formData.chart_data) {
        try {
            chart_data = JSON.parse(formData.chart_data);
        } catch (error) {
            alert('Formato de JSON inválido para Dados do Odontograma.');
            return;
        }
    }

    const dataToSubmit = {
        ...formData,
        chart_data,
    };

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
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
            <label className="block text-gray-700 mb-2">Tipo de Odontograma</label>
            <select
              name="chart_type"
              value={formData.chart_type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="inicial">Inicial</option>
              <option value="plano_tratamento">Plano de Tratamento</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Dados do Odontograma (JSON)</label>
            <textarea
              name="chart_data"
              value={formData.chart_data}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="10"
              placeholder='{"18": {"status": "hígido"}, "17": {"status": "extraído"}}'
            />
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-amber-600 transition-colors"
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

