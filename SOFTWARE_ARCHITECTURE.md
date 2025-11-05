# Análise Detalhada do Software de Gestão de Clínica Odontológica

## 1. Visão Geral

Este documento fornece uma análise detalhada da arquitetura e engenharia do software de gestão de clínica odontológica. O projeto é um monorepo que consiste em duas partes principais: um **frontend** (aplicação de cliente) e um **backend** (servidor de API).

## 2. Tecnologias Utilizadas

### Frontend

- **Framework**: React com Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router (`react-router-dom`)
- **Hooks**: Gerenciamento de estado e lógica (`useState`, `useEffect`, `useContext`, e hooks customizados)

### Backend

- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Banco de Dados**: Atualmente, um banco de dados baseado em arquivo JSON (`clinic.json`), com esquemas SQL (`schema.sql`, `schema.sqlite.sql`) disponíveis para migração.
- **Autenticação**: JWT (JSON Web Tokens)
- **Middleware**:
  - `cors`: Para controle de acesso entre origens (Cross-Origin Resource Sharing).
  - `helmet`: Para segurança, configurando cabeçalhos HTTP.
  - `compression`: Para comprimir as respostas e melhorar o desempenho.
  - `morgan`: Para logging de requisições HTTP.
  - `express-rate-limit`: Para limitar a taxa de requisições.

## 3. Arquitetura do Software

### 3.1. Estrutura de Monorepo

O projeto utiliza uma estrutura de monorepo, com o código do frontend e do backend no mesmo repositório, mas em diretórios separados (`src` para o frontend e `server` para o backend). Isso facilita o desenvolvimento e o gerenciamento do projeto como um todo.

### 3.2. Arquitetura do Frontend

O frontend é uma Single-Page Application (SPA) construída com React. A estrutura de diretórios é a seguinte:

- **`src/components`**: Contém componentes React reutilizáveis, como `Calendar`, `PatientForm`, `Layout`, etc.
- **`src/pages`**: Contém as páginas principais da aplicação, que são montadas a partir dos componentes. Exemplos: `PacientesPage`, `FinanceiroPage`.
- **`src/hooks`**: Contém hooks customizados para gerenciar a lógica de estado e efeitos colaterais, como `useAuth` para autenticação e `usePatients` para buscar dados de pacientes.
- **`src/services`**: Contém a lógica para fazer chamadas à API do backend, como o `api.ts` que provavelmente usa `axios` ou `fetch`.
- **`src/App.tsx`**: É o componente raiz que configura o roteamento da aplicação com `react-router-dom`.
- **`src/main.tsx`**: É o ponto de entrada da aplicação React.

### 3.3. Arquitetura do Backend

O backend é uma API RESTful construída com Express.js. A estrutura de diretórios segue um padrão comum em aplicações Express:

- **`server/src/config`**: Contém a configuração da aplicação, como a conexão com o banco de dados (`database.ts`).
- **`server/src/controllers`**: Contém a lógica de negócio para cada rota. Por exemplo, `patientController.ts` tem funções para criar, ler, atualizar e deletar pacientes.
- **`server/src/models`**: Define os modelos de dados da aplicação, como `Patient.ts` e `Appointment.ts`.
- **`server/src/routes`**: Define as rotas da API. Cada arquivo em `routes` corresponde a um recurso (e.g., `patients.ts`) e mapeia as rotas para as funções nos `controllers`.
- **`server/src/middleware`**: Contém middleware customizados, como `auth.ts` para verificar a autenticação JWT e `errorHandler.ts` para tratamento de erros.
- **`server/src/index.ts`**: É o ponto de entrada do servidor, onde o Express é configurado, os middlewares são aplicados e as rotas são registradas.

## 4. Fluxo de Dados

Um exemplo de fluxo de dados, como o cadastro de um novo paciente:

1.  O usuário preenche o formulário de novo paciente no frontend (componente `PatientForm`).
2.  Ao submeter o formulário, uma função no frontend (provavelmente no hook `usePatients`) é chamada.
3.  Essa função faz uma requisição POST para a API do backend, no endpoint `/api/patients`.
4.  A rota em `server/src/routes/patients.ts` recebe a requisição e chama a função correspondente no `patientController.ts`.
5.  O `patientController` valida os dados recebidos e usa a função `executeQuery` do `database.ts` para inserir o novo paciente no arquivo `clinic.json`.
6.  O backend retorna uma resposta de sucesso com os dados do novo paciente.
7.  O frontend recebe a resposta e atualiza o estado da aplicação, exibindo o novo paciente na lista.

## 5. Autenticação

A autenticação é baseada em JWT. O fluxo é o seguinte:

1.  O usuário envia email e senha para o endpoint `/api/auth/login`.
2.  O `authController` verifica as credenciais.
3.  Se as credenciais estiverem corretas, um JWT é gerado e retornado ao cliente.
4.  O frontend armazena o token (geralmente em `localStorage` ou `sessionStorage`).
5.  Para cada requisição subsequente a rotas protegidas, o frontend envia o token no cabeçalho `Authorization`.
6.  O middleware `auth.ts` no backend intercepta a requisição, verifica a validade do token e, se for válido, permite o acesso à rota.

## 6. Áreas para Melhoria

- **Banco de Dados**: Como já discutido, a substituição do banco de dados JSON por um SGBD como PostgreSQL ou MySQL é crucial para a escalabilidade, segurança e integridade dos dados.
- **Testes**: O projeto parece não ter uma suíte de testes automatizados. A adição de testes unitários e de integração para o backend e o frontend aumentaria a confiabilidade e facilitaria a manutenção.
- **Gerenciamento de Estado no Frontend**: Para uma aplicação com essa complexidade, a utilização de uma biblioteca de gerenciamento de estado mais robusta, como Redux Toolkit ou Zustand, poderia simplificar o controle do estado global da aplicação.
- **Validação de Dados**: A validação de dados no backend pode ser aprimorada com o uso de uma biblioteca como o `zod` ou `joi`, tornando o código mais declarativo e seguro.

## 7. Casos de Uso (Use Cases)

Com base na estrutura da aplicação, podemos inferir os seguintes atores e seus respectivos casos de uso:

### 7.1. Atores

-   **Administrador**: Usuário com acesso total ao sistema, responsável pela configuração e gerenciamento de usuários.
-   **Dentista**: Profissional de saúde que gerencia pacientes, agendamentos e prontuários.
-   **Recepcionista**: Usuário responsável pelo agendamento de consultas e cadastro de pacientes.

### 7.2. Casos de Uso por Ator

#### Administrador

-   **Gerenciar Usuários**:
    -   Criar novas contas de usuário (dentistas, recepcionistas).
    -   Editar informações de usuários existentes.
    -   Desativar ou excluir contas de usuário.
-   **Configurar o Sistema**:
    -   Acessar a página de administração (`/admin`).
    -   (Potencialmente) Definir configurações gerais da clínica.
-   **Gerar Relatórios**:
    -   Acessar a página de relatórios (`/relatorios`).
    -   Visualizar relatórios financeiros e de agendamento.
-   **Gerenciar Finanças**:
    -   Acessar a página financeira (`/financeiro`).
    -   Registrar e visualizar transações (receitas e despesas).

#### Dentista

-   **Gerenciar Agenda**:
    -   Visualizar o calendário de agendamentos (`/agendamentos`).
    -   Ver detalhes de uma consulta.
    -   Marcar uma consulta como "concluída".
-   **Gerenciar Pacientes**:
    -   Acessar a lista de pacientes (`/pacientes`).
    -   Buscar por pacientes específicos.
    -   Visualizar os detalhes de um paciente.
-   **Gerenciar Prontuários**:
    -   Acessar a página de prontuários (`/prontuarios`).
    -   Criar e editar a anamnese de um paciente.
    -   Criar e atualizar o odontograma de um paciente.
    -   Coletar e salvar a assinatura digital do paciente.

#### Recepcionista

-   **Gerenciar Agenda**:
    -   Visualizar o calendário de agendamentos (`/agendamentos`).
    -   Agendar uma nova consulta para um paciente com um dentista específico.
    -   Confirmar, cancelar ou reagendar uma consulta.
-   **Gerenciar Pacientes**:
    -   Acessar a lista de pacientes (`/pacientes`).
    -   Cadastrar um novo paciente no sistema.
    -   Atualizar as informações de contato e dados cadastrais de um paciente.