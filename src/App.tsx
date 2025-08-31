import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Agendamentos from "./components/Agendamentos";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AdminPage from "./pages/AdminPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import PacientesPage from "./pages/PacientesPage";
import ProntuariosPage from "./pages/ProntuariosPage";
import RelatoriosPage from "./pages/RelatoriosPage";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="agendamentos" element={<Agendamentos />} />
        <Route path="pacientes" element={<PacientesPage />} />
        <Route path="prontuarios" element={<ProntuariosPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />

        {user?.role === "admin" && (
          <Route path="admin" element={<AdminPage />} />
        )}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
