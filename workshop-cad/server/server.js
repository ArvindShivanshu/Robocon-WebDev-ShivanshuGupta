import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import workshopRoutes from './routes/workshopRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SolidWorks & Altium ECAD-MCAD Workshop API'
  });
});

// API Routes
app.use('/api/workshop', workshopRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start Server
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 [Server] SolidWorks & Altium Workshop Backend live on http://localhost:${PORT}`);
    console.log(`📡 [API] Endpoint available at http://localhost:${PORT}/api/workshop/info`);
  });
}

start();
