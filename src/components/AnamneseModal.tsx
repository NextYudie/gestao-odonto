import { useState, useEffect } from 'react';

const predefinedAllergies = ['Penicilina', 'Aspirina', 'Látex', 'Amoxicilina', 'Ibuprofeno', 'Nenhuma'];
const predefinedSystemicDiseases = ['Hipertensão', 'Diabetes Tipo 1', 'Diabetes Tipo 2', 'Asma', 'Hipotireoidismo', 'Nenhuma'];

const AnamneseModal = ({ isOpen, onClose, onSubmit, patientId }) => {
  const [formData, setFormData] = useState({
    patient_id: patientId,
    chief_complaint: '',
    history_of_present_illness: '',
    family_disease_history: '',
    medications_in_use: '',
    oral_hygiene_habits: '',
  });
  const [allergyInput, setAllergyInput] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [showAllergyOptions, setShowAllergyOptions] = useState(false);
  const [diseaseInput, setDiseaseInput] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [showDiseaseOptions, setShowDiseaseOptions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patient_id: patientId,
        chief_complaint: '',
        history_of_present_illness: '',
        family_disease_history: '',
        medications_in_use: '',
        oral_hygiene_habits: '',
      });
      setAllergyInput('');
      setSelectedAllergies([]);
      setShowAllergyOptions(false);
      setDiseaseInput('');
      setSelectedDiseases([]);
      setShowDiseaseOptions(false);
    }
  }, [isOpen, patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergyInputChange = (e) => {
    setAllergyInput(e.target.value);
    if (!showAllergyOptions) {
      setShowAllergyOptions(true);
    }
  };

  const handleAddAllergy = (allergy) => {
    if (allergy && !selectedAllergies.includes(allergy)) {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
    setAllergyInput('');
    setShowAllergyOptions(false);
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setSelectedAllergies(selectedAllergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleDiseaseInputChange = (e) => {
    setDiseaseInput(e.target.value);
    if (!showDiseaseOptions) {
      setShowDiseaseOptions(true);
    }
  };

  const handleAddDisease = (disease) => {
    if (disease && !selectedDiseases.includes(disease)) {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
    setDiseaseInput('');
    setShowDiseaseOptions(false);
  };

  const handleRemoveDisease = (diseaseToRemove) => {
    setSelectedDiseases(selectedDiseases.filter(disease => disease !== diseaseToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSubmit = {
        ...formData,
        allergies: selectedAllergies,
        systemic_diseases: selectedDiseases,
    };

    onSubmit(dataToSubmit);
  };

  const filteredAllergies = predefinedAllergies.filter(
    (allergy) =>
      allergy.toLowerCase().includes(allergyInput.toLowerCase()) &&
      !selectedAllergies.includes(allergy)
  );

  const filteredDiseases = predefinedSystemicDiseases.filter(
    (disease) =>
      disease.toLowerCase().includes(diseaseInput.toLowerCase()) &&
      !selectedDiseases.includes(disease)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nova Anamnese</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Queixa Principal</label>
              <textarea
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">História da Doença Atual</label>
              <textarea
                name="history_of_present_illness"
                value={formData.history_of_present_illness}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Histórico de Doença na Família</label>
              <textarea
                name="family_disease_history"
                value={formData.family_disease_history}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Alergias</label>
              <div className="relative">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={handleAllergyInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy(allergyInput)}
                  onFocus={() => setShowAllergyOptions(true)}
                  onBlur={() => setTimeout(() => setShowAllergyOptions(false), 200)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500 pr-8"
                  placeholder="Digite para buscar ou adicionar"
                />
                {showAllergyOptions && filteredAllergies.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                    {filteredAllergies.map((allergy) => (
                      <li
                        key={allergy}
                        onMouseDown={() => handleAddAllergy(allergy)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {allergy}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAllergies.map(allergy => (
                  <div key={allergy} className="bg-amber-100 text-amber-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300 flex items-center">
                    {allergy}
                    <button type="button" onClick={() => handleRemoveAllergy(allergy)} className="ml-2 text-amber-800 hover:text-amber-600">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Doenças Sistêmicas</label>
              <div className="relative">
                <input
                  type="text"
                  value={diseaseInput}
                  onChange={handleDiseaseInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDisease(diseaseInput)}
                  onFocus={() => setShowDiseaseOptions(true)}
                  onBlur={() => setTimeout(() => setShowDiseaseOptions(false), 200)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500 pr-8"
                  placeholder="Digite para buscar ou adicionar"
                />
                {showDiseaseOptions && filteredDiseases.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                    {filteredDiseases.map((disease) => (
                      <li
                        key={disease}
                        onMouseDown={() => handleAddDisease(disease)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {disease}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDiseases.map(disease => (
                  <div key={disease} className="bg-amber-100 text-amber-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300 flex items-center">
                    {disease}
                    <button type="button" onClick={() => handleRemoveDisease(disease)} className="ml-2 text-amber-800 hover:text-amber-600">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Medicamentos em Uso</label>
              <textarea
                name="medications_in_use"
                value={formData.medications_in_use}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Hábitos de Higiene Oral</label>
              <textarea
                name="oral_hygiene_habits"
                value={formData.oral_hygiene_habits}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="2"
              />
            </div>
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

export default AnamneseModal;