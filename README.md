<h1 align="center">🦷 OdontoGestão</h1>

<p align="center">
  Sistema completo de gestão para clínicas odontológicas — agendamentos, prontuários, odontograma interativo, financeiro e muito mais.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 📋 Sobre o Projeto

O **OdontoGestão** é uma aplicação web full-stack desenvolvida para digitalizar e centralizar a gestão de clínicas odontológicas. A plataforma cobre todo o fluxo operacional de uma clínica: do agendamento de consultas ao registro de prontuários, passando pelo controle financeiro e geração de relatórios.

O projeto foi construído com arquitetura **monorepo**, separando claramente o frontend (React SPA) do backend (API RESTful com Express), e utiliza **JWT** para autenticação segura com suporte a refresh tokens.

---

## ✨ Funcionalidades

### 🗓️ Agendamentos
- Calendário visual mensal com navegação por mês
- Visualização de consultas por dia com modal de detalhes
- Cadastro e edição de consultas com seleção de dentista, especialidade e horários disponíveis
- Status de consulta: agendada, confirmada, concluída, cancelada

### 👥 Pacientes
- Cadastro completo: nome, CPF, data de nascimento, telefone, email, endereço e contato de emergência
- Listagem paginada com busca em tempo real
- Controle de status (ativo/inativo)

### 📋 Prontuários
- **Anamnese clínica**: formulário completo de histórico de saúde do paciente
- **Odontograma interativo**: mapa visual de todos os dentes com marcação de condições (saudável, cárie, extração, coroa, etc.) — suporte a odontograma inicial e plano de tratamento
- **Assinatura digital**: coleta de assinatura via canvas (desenho na tela) ou upload de documento PDF assinado

### 💰 Financeiro
- Resumo mensal: receita total, despesas e lucro líquido
- Registro de transações (receitas e despesas) com descrição e data
- Controle de pagamento por consulta (pago/pendente)

### 📊 Relatórios
- Geração de relatórios por período (semanal, mensal, anual)
- Visão consolidada de desempenho da clínica

### ⚙️ Configurações & Admin
- Gestão de dentistas: cadastro, edição e desativação
- Perfil do usuário logado
- Painel administrativo para gestão de usuários do sistema (acesso restrito ao role `admin`)

---

## 🏗️ Arquitetura

```
odonto-gestao/
├── src/                        ← Frontend (React + Vite)
│   ├── components/             ← 26 componentes reutilizáveis
│   ├── pages/                  ← 6 páginas principais
│   ├── hooks/                  ← Custom hooks (useAuth, usePatients, useAppointments...)
│   ├── services/api.ts         ← Camada de comunicação com a API
│   └── types/                  ← Interfaces e tipos TypeScript
│
└── server/                     ← Backend (Node.js + Express)
    └── src/
        ├── controllers/        ← Lógica de negócio (9 controllers)
        ├── routes/             ← Rotas REST (9 grupos)
        ├── middleware/         ← Auth JWT, rate limiting, error handling
        ├── models/             ← Modelos de dados
        └── database/           ← Schemas SQL (MySQL e SQLite)
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 7, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js, Express 4, TypeScript 5 |
| **Banco de Dados** | MySQL (schema SQL incluído) |
| **Autenticação** | JWT (access token 15min + refresh token 7 dias) |
| **Segurança** | Helmet, CORS, bcryptjs, Express Rate Limit |
| **Utilitários** | date-fns, Multer (upload), Morgan (logs), Joi (validação) |

---

## 🔌 API REST — Endpoints

| Recurso | Prefixo | Operações |
|---|---|---|
| Autenticação | `/api/auth` | login, logout, me, refresh |
| Pacientes | `/api/patients` | CRUD + estatísticas |
| Agendamentos | `/api/appointments` | CRUD + today + by-patient + slots disponíveis + pagamento |
| Dentistas | `/api/doctors` | CRUD paginado |
| Anamneses | `/api/anamneses` | Criar + listar por paciente |
| Odontogramas | `/api/odontograms` | CRUD por paciente |
| Assinaturas | `/api/signatures` | Upload digital/PDF + listar |
| Transações | `/api/transactions` | CRUD + resumo financeiro |
| Relatórios | `/api/reports` | Relatórios por período |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- MySQL 8+

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/odonto-gestao.git
cd odonto-gestao
```

### 2. Configure e inicie o Backend

```bash
cd server

# Instale as dependências
npm install

# Copie e configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do MySQL

# Inicialize o banco de dados
npm run init-db

# Inicie o servidor de desenvolvimento
npm run dev
```

> O servidor estará disponível em `http://localhost:3001`

### 3. Configure e inicie o Frontend

```bash
# Na raiz do projeto
npm install
npm run dev
```

> A aplicação estará disponível em `http://localhost:5173`

### 4. Acesse com as credenciais de demonstração

```
Email:  admin@clinic.com
Senha:  admin123
```

---

## 👥 Perfis de Usuário

| Role | Acesso |
|---|---|
| `admin` | Acesso total, incluindo gestão de usuários |
| `dentista` | Agendamentos, Pacientes, Prontuários, Relatórios |
| `recepcionista` | Agendamentos, Pacientes |

---

## 🔐 Fluxo de Autenticação

```
Login → JWT (15min) + Refresh Token (7 dias)
     → Tokens armazenados no localStorage
     → Em erro 401: redirect automático para /login
     → Refresh automático do access token
```

---

## 📁 Variáveis de Ambiente

Copie `server/.env.example` para `server/.env` e configure:

```env
PORT=3001
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinic_management
DB_USER=root
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua-chave-secreta
JWT_REFRESH_SECRET=sua-chave-refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

---

## 📄 Licença

Distribuído sob a licença MIT.
