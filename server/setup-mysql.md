# MySQL Setup Guide para WSL/Windows

Como não conseguimos instalar MySQL automaticamente no WSL, siga estes passos:

## Opção 1: MySQL no Windows (Recomendado)

1. **Baixe MySQL Installer**: https://dev.mysql.com/downloads/installer/
2. **Execute o installer** e escolha "Developer Default"
3. **Configure root password** (anote para o .env)
4. **Inicie MySQL Workbench** para gerenciar

## Opção 2: MySQL no WSL

```bash
# Execute estes comandos no terminal WSL:
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

## Criar Database

Após instalar, execute no MySQL:

```sql
-- Conectar como root
mysql -u root -p

-- Criar database
CREATE DATABASE clinic_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário para a aplicação (opcional)
CREATE USER 'clinic_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON clinic_management.* TO 'clinic_user'@'localhost';
FLUSH PRIVILEGES;

-- Usar o database
USE clinic_management;

-- Executar o schema (copie e cole o conteúdo de schema.sql)
```

## Configurar .env

Após criar o database, configure seu `.env`:

```env
# Para usuário root
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinic_management
DB_USER=root
DB_PASSWORD=sua_senha_root

# Ou para usuário específico
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinic_management
DB_USER=clinic_user
DB_PASSWORD=sua_senha_segura

# Outras configurações obrigatórias
JWT_SECRET=cole-uma-string-aleatoria-longa-aqui
JWT_REFRESH_SECRET=cole-outra-string-aleatoria-longa-aqui
```

## Testar Conexão

Após configurar, teste com:
```bash
cd server
npm run dev
```

Se der erro de conexão, verifique se o MySQL está rodando:
- Windows: Services → MySQL
- WSL: `sudo service mysql start`