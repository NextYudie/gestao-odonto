import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

const navigation: NavigationItem[] = [
  { path: "/", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { path: "/agendamentos", label: "Agendamentos", icon: "fas fa-calendar-alt" },
  { path: "/pacientes", label: "Pacientes", icon: "fas fa-user-injured" },
  { path: "/prontuarios", label: "Prontuários", icon: "fas fa-file-medical" },
  { path: "/relatorios", label: "Relatórios", icon: "fas fa-chart-bar" },
  { path: "/configuracoes", label: "Configurações", icon: "fas fa-cog" },
];

interface SidebarProps {
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = (): void => {
    if (window.confirm("Deseja realmente sair do sistema?")) {
      logout();
    }
  };

  return (
    <div className="sidebar w-64 min-h-screen text-white p-4 hidden md:block">
      <div className="text-center mb-8">
        <img
          src="https://placehold.co/120x120"
          alt="Logo da Clínica Saúde Total"
          className="mx-auto rounded-full border-4 border-white mb-3"
        />
        <h1 className="text-xl font-bold">Clínica Saúde Total</h1>
        <p className="text-sm opacity-80">Sistema de Gestão Médica</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item w-full flex items-center p-3 rounded-lg text-left transition-all duration-300 ${
                isActive ? "bg-blue-700" : "hover:bg-blue-600"
              }`
            }
          >
            <i className={`${item.icon} w-6 mr-3`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-blue-400">
        <div className="flex items-center p-3">
          <img
            src="https://placehold.co/40x40"
            alt={`Foto de perfil do ${user?.name}`}
            className="rounded-full mr-3 w-10 h-10"
          />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs opacity-70">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 p-3 text-left rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-sign-out-alt w-6 mr-3"></i>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
