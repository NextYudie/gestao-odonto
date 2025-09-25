import React, { useEffect, useState } from "react";
import DoctorForm from "../components/DoctorForm";
import { useDoctors } from "../hooks/useDoctors";
import type { Doctor } from "../types";

const AdminPage: React.FC = () => {
  const {
    doctors,
    pagination,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    setError,
  } = useDoctors();

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors(1, 20, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDeleteDoctor = async (doctor: Doctor) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o médico ${doctor.name}?`)
    ) {
      try {
        setActionLoading(true);
        await deleteDoctor(doctor.id);
      } catch (error: any) {
        alert(`Erro ao excluir médico: ${error.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleFormSubmit = async (
    doctorData: Omit<Doctor, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setActionLoading(true);

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, doctorData);
      } else {
        await createDoctor(doctorData);
      }

      setShowForm(false);
      setEditingDoctor(null);
    } catch (error: any) {
      throw error; // Let the form handle the error display
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDoctor(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="flex items-center">
          <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mr-3"></i>
          <span className="text-lg">Carregando médicos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Médicos</h1>
        <p className="text-gray-600">Gerencie o cadastro de médicos</p>
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
            Lista de Médicos ({pagination?.total || 0})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            <button
              onClick={handleCreateDoctor}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i>
              Novo Médico
            </button>
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-user-md text-4xl mb-4"></i>
            <p className="text-lg">
              {searchTerm
                ? "Nenhum médico encontrado"
                : "Nenhum médico cadastrado"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateDoctor}
                className="mt-4 text-blue-600 hover:text-amber-800"
              >
                Cadastrar primeiro médico
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">CRO</th>
                  <th className="text-left p-3">Especialidade</th>
                  <th className="text-left p-3">Telefone</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Cadastro</th>
                  <th className="text-left p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        {doctor.email && (
                          <div className="text-sm text-gray-500">
                            {doctor.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">{doctor.cro}</td>
                    <td className="p-3">{doctor.specialty}</td>
                    <td className="p-3">{doctor.phone || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          doctor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {doctor.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatDate(doctor.created_at || "")}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDoctor(doctor)}
                          disabled={actionLoading}
                          className="text-blue-600 hover:text-amber-800 disabled:opacity-50"
                          title="Editar médico"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Excluir médico"
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
        <DoctorForm
          doctor={editingDoctor}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default AdminPage;

