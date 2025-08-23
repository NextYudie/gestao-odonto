# Yudi App - API Server

API backend for the medical clinic management system built with Node.js, Express, and TypeScript.

## Features

- 🔐 JWT Authentication with refresh tokens
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📊 Patient and appointment management
- 🏥 Medical staff authentication
- ⚡ TypeScript for type safety
- 🗄️ MySQL database integration
- 📝 Input validation with Joi
- 🔄 Error handling and logging
- 🧪 Test-ready structure

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - Database connection settings
   - JWT secrets (generate strong random strings)
   - CORS settings
   - Rate limiting configurations

5. Set up the database:
   ```bash
   mysql -u root -p < src/database/schema.sql
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Production

Build and start production server:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh access token

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/stats` - Patient statistics
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/status` - Update patient status
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/today` - Today's appointments
- `GET /api/appointments/stats` - Appointment statistics
- `GET /api/appointments/available-slots/:doctorId/:date` - Available time slots
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment

## Security Features

- Rate limiting on all routes
- Strict rate limiting on authentication endpoints
- JWT token authentication with automatic refresh
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- SQL injection prevention

## Environment Variables

See `.env.example` for all available configuration options.

## Health Check

The server provides a health check endpoint at `/health` that returns server status and uptime information.

## Error Handling

The API uses structured error responses with appropriate HTTP status codes and descriptive messages in Portuguese for the frontend.