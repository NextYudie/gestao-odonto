import React, { useState, useRef, useEffect } from "react";
import type { User, Notification } from "../types";

const notifications: Notification[] = [
  {
    id: 1,
    message: "Nova consulta agendada para amanhã às 14:00",
    time: "há 2 minutos",
    type: "info",
  },
  {
    id: 2,
    message: "Resultados de exames disponíveis - Paciente Maria",
    time: "há 1 hora",
    type: "success",
  },
  {
    id: 3,
    message: "Lembrete: Reabastecer medicamentos",
    time: "há 3 horas",
    type: "warning",
  },
];

interface TopBarProps {
  notificationCount: number;
  user: User | null;
}

const TopBar: React.FC<TopBarProps> = ({ notificationCount, user }) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const notificationRef = useRef<HTMLDivElement>(null);

  const getNotificationColor = (type: string): string => {
    const colors: Record<string, string> = {
      info: "border-blue-500 bg-blue-50",
      success: "border-green-500 bg-green-50",
      warning: "border-red-500 bg-red-50",
    };
    return colors[type] || colors.info;
  };

  const toggleNotifications = (): void => {
    setShowNotifications(!showNotifications);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <button className="md:hidden text-amber-600">
        <i className="fas fa-bars text-xl"></i>
      </button>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 text-gray-600 hover:text-amber-600 relative"
          >
            <i className="fas fa-bell text-xl"></i>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 z-50">
              <h3 className="font-bold mb-3">
                Notificações ({notificationCount})
              </h3>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 border-l-4 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <img
            src="https://i.cbc.ca/1.5359228.1577206958!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_1180/smudge-the-viral-cat.jpg?im="
            alt={`Foto de perfil do ${user?.name}`}
            className="rounded-full mr-2 w-10 h-10"
          />
          <span className="hidden md:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

