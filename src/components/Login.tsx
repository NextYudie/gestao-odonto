import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { LoginFormData } from "../types";

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log('Login form submitted', { email: formData.email });

    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Attempting login...');
      await login(formData.email, formData.password, formData.rememberMe);
      console.log('Login successful');
      onLogin?.();
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg mb-4">
            <i className="fas fa-heartbeat text-3xl text-amber-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Clínica Saúde Total
          </h1>
          <p className="text-gray-600">Sistema de Gestão Médica</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Fazer Login
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Acesse sua conta para continuar
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="fas fa-envelope mr-2 text-gray-400"></i>
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="digite@seu.email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="fas fa-lock mr-2 text-gray-400"></i>
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">
                  Lembrar de mim
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg font-medium transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-200"
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Credenciais de Demonstração */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <i className="fas fa-info-circle mr-1"></i>
              Credenciais de demonstração:
            </p>
            <div className="text-xs space-y-1">
              <div className="font-mono bg-white px-2 py-1 rounded border">
                <strong>Admin:</strong> admin@clinica.com / admin123
              </div>
              <div className="font-mono bg-white px-2 py-1 rounded border">
                <strong>Médico:</strong> medico@clinica.com / admin123
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Clínica Saúde Total. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


