import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ConfiguracoesPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: 'fas fa-user' },
    { id: 'security', label: 'Segurança', icon: 'fas fa-shield-alt' },
    { id: 'notifications', label: 'Notificações', icon: 'fas fa-bell' },
    { id: 'system', label: 'Sistema', icon: 'fas fa-cogs' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema e sua conta</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <i className={`${tab.icon} w-5 mr-3`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src="https://placehold.co/80x80"
                      alt="Avatar"
                      className="w-20 h-20 rounded-full"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Alterar Foto
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">E-mail</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Especialidade</label>
                      <input
                        type="text"
                        defaultValue={user?.role}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CRM</label>
                      <input
                        type="text"
                        placeholder="123456"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Segurança da Conta</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Alterar Senha</h3>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Senha atual"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Nova senha"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Alterar Senha
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-3">Autenticação em Duas Etapas</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">2FA Desativado</p>
                        <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Ativar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Preferências de Notificação</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Novas consultas agendadas', desc: 'Receber notificação quando uma nova consulta for agendada' },
                    { title: 'Lembretes de consulta', desc: 'Receber lembrete 30 minutos antes da consulta' },
                    { title: 'Resultados de exames', desc: 'Notificar quando resultados de exames estiverem disponíveis' },
                    { title: 'Relatórios mensais', desc: 'Receber relatório mensal de atividades por e-mail' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Aparência</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <input type="radio" name="theme" id="light" defaultChecked />
                        <label htmlFor="light">Tema Claro</label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input type="radio" name="theme" id="dark" />
                        <label htmlFor="dark">Tema Escuro</label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input type="radio" name="theme" id="auto" />
                        <label htmlFor="auto">Automático</label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-3">Backup de Dados</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">Último backup: 20/11/2024 às 14:30</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        <i className="fas fa-download mr-2"></i>
                        Fazer Backup Agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;