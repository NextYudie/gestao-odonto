import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

const navigationAdmin: NavigationItem[] = [
  { path: "/", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { path: "/agendamentos", label: "Agendamentos", icon: "fas fa-calendar-alt" },
  { path: "/pacientes", label: "Pacientes", icon: "fas fa-user-injured" },
  { path: "/prontuarios", label: "Prontuários", icon: "fas fa-file-medical" },
  { path: "/relatorios", label: "Relatórios", icon: "fas fa-chart-bar" },
  { path: "/admin", label: "Admin", icon: "fas fa-user-shield" },
  { path: "/configuracoes", label: "Configurações", icon: "fas fa-cog" },
];

const navigationMedic: NavigationItem[] = [
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
  console.log(user);

  const handleLogout = (): void => {
    if (window.confirm("Deseja realmente sair do sistema?")) {
      logout();
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="sidebar w-64 min-h-screen text-white p-4 hidden md:block">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">Clínica Sahur</h1>
        <p className="text-sm opacity-80">Sistema de Gestão Médica</p>
      </div>

      <nav className="space-y-2 flex-1">
        {isAdmin ? (
          <>
            {navigationAdmin.map((item) => (
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
          </>
        ) : (
          <>
            {navigationMedic.map((item) => (
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
          </>
        )}
      </nav>

      <div className="mt-auto pt-8 border-t border-blue-400">
        <div className="flex items-center p-1">
          <img
            src="https://i.cbc.ca/1.5359228.1577206958!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_1180/smudge-the-viral-cat.jpg?im="
            alt={`Foto de perfil do ${user?.name}`}
            className="rounded-full mr-3 w-20 h-20"
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
