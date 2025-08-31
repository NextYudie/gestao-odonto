import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createConnection } from '@/config/database';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { generalRateLimit } from '@/middleware/rateLimiter';
import authRoutes from '@/routes/auth';
import patientRoutes from '@/routes/patients';
import appointmentRoutes from '@/routes/appointments';
import doctorRoutes from '@/routes/doctors';

config();

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await createConnection();
    console.log('✅ Database connected successfully');

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    app.use(compression());
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    if (process.env.NODE_ENV !== 'production') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
    }

    // Rate limiting disabled for development
    // app.use(generalRateLimit);

    app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/patients', patientRoutes);
    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/doctors', doctorRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const gracefulShutdown = (signal: string) => {
      console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();