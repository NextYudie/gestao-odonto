import React, { useState } from "react";
import PatientForm from "../components/PatientForm";
import { usePatients } from "../hooks/usePatients";
import type { Patient } from "../types";

const PacientesPage: React.FC = () => {
  const {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    setError,
  } = usePatients();

  // Debug log
  console.log(patients);

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // const filteredPatients = Array.isArray(patients)
  //   ? patients.filter(
  //       (patient) =>
  //         patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         patient.cpf.includes(searchTerm) ||
  //         (patient.email &&
  //           patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  //     )
  //   : [];

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o paciente ${patient.name}?`
      )
    ) {
      try {
        setActionLoading(true);
        await deletePatient(patient.id);
      } catch (error: any) {
        alert(`Erro ao excluir paciente: ${error.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleFormSubmit = async (
    patientData: Omit<Patient, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setActionLoading(true);

      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData);
      } else {
        await createPatient(patientData);
      }

      setShowForm(false);
      setEditingPatient(null);
    } catch (error: any) {
      throw error; // Let the form handle the error display
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPatient(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="flex items-center">
          <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mr-3"></i>
          <span className="text-lg">Carregando pacientes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
        <p className="text-gray-600">Gerencie o cadastro de pacientes</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">
            Lista de Pacientes ({Array.isArray(patients) ? patients.length : 0})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            <button
              onClick={handleCreatePatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i>
              Novo Paciente
            </button>
          </div>
        </div>

        {patients.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-user-injured text-4xl mb-4"></i>
            <p className="text-lg">
              {searchTerm
                ? "Nenhum paciente encontrado"
                : "Nenhum paciente cadastrado"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreatePatient}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Cadastrar primeiro paciente
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">CPF</th>
                  <th className="text-left p-3">Idade</th>
                  <th className="text-left p-3">Telefone</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Cadastro</th>
                  <th className="text-left p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {patients.data.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        {patient.email && (
                          <div className="text-sm text-gray-500">
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">{patient.cpf}</td>
                    <td className="p-3">
                      {calculateAge(patient.birth_date)} anos
                    </td>
                    <td className="p-3">{patient.phone || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          patient.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatDate(patient.created_at || "")}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPatient(patient)}
                          disabled={actionLoading}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          title="Editar paciente"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Excluir paciente"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default PacientesPage;
