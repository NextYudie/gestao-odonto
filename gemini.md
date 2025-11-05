# Gemini - Entendendo o Software de Gestão de Clínica Odontológica

Este documento fornece uma visão geral do projeto, sua estrutura e como executá-lo.

## Visão Geral do Projeto

Este é um sistema de gerenciamento de clínica odontológica projetado para ajudar a gerenciar pacientes, agendamentos, prontuários e finanças. A aplicação é dividida em duas partes principais:

-   **Frontend:** Uma interface de usuário rica e interativa para dentistas e administradores.
-   **Backend:** Uma API RESTful que lida com a lógica de negócios e a interação com o banco de dados.

## Tecnologias Utilizadas

### Frontend

-   **Framework:** React com Vite
-   **Linguagem:** TypeScript
-   **Estilização:** Tailwind CSS
-   **Roteamento:** React Router

### Backend

-   **Framework:** Express.js
-   **Linguagem:** TypeScript
-   **Banco de Dados:** SQlite
-   **Autenticação:** JWT (JSON Web Tokens)

## Estrutura do Projeto

O projeto é um monorepo com o frontend e o backend em pastas separadas:

```
/
├── server/         # Código do backend (API)
│   ├── src/
│   │   ├── controllers/  # Lógica para cada rota
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Definições de rotas da API
│   │   └── index.ts      # Ponto de entrada do servidor
│   └── package.json
│
├── src/            # Código do frontend (React App)
│   ├── components/   # Componentes React reutilizáveis
│   ├── pages/        # Páginas da aplicação
│   ├── services/     # Lógica de chamada da API
│   └── App.tsx       # Componente principal
│
└── package.json
```

## Principais Funcionalidades

-   **Gerenciamento de Pacientes:** Cadastro e edição de informações de pacientes.
-   **Agendamentos:** Visualização de calendário, agendamento e gerenciamento de consultas.
-   **Prontuários:**
    -   **Anamnese:** Histórico médico do paciente.
    -   **Odontograma:** Representação visual da saúde bucal do paciente.
-   **Financeiro:** Controle de transações financeiras.
-   **Autenticação:** Login seguro para usuários.
-   **Relatórios:** Geração de relatórios (funcionalidade em desenvolvimento).

## Como Executar

### Pré-requisitos

-   Node.js e npm instalados.
-   Um servidor de banco de dados SQL (como MySQL ou PostgreSQL) se você quiser usar a funcionalidade completa do banco de dados.

### Backend

1.  **Navegue até a pasta do servidor:**
    ```bash
    cd server
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    -   Copie `.env.example` para `.env`.
    -   Preencha as informações do banco de dados e outras configurações.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001` (ou a porta configurada em `.env`).

### Frontend

1.  **Navegue até a pasta raiz do projeto:**
    ```bash
    cd .. 
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta se a 5173 estiver em uso).
