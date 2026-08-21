import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Same-origin / curl / server-to-server requests send no Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check — also reports which database we are actually attached to, so a
// cross-project misconfiguration is visible without reading the code.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Firmitas Admin & CMS Backend',
    database: mongoose.connection.name || null,
    dbState: mongoose.STATES[mongoose.connection.readyState],
    time: new Date()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Connect DB & Launch. If the database is unreachable or points at the wrong
// project, refuse to start rather than serving empty responses.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [Firmitas Backend API] running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ [Firmitas Backend API] failed to start:', err.message);
    process.exit(1);
  });
