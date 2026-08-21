import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Shreeraj Traders Admin & CMS Backend', time: new Date() });
});

// API Routes
app.use('/api', apiRoutes);

// Connect DB & Launch
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [Shreeraj Traders Backend API] running on http://localhost:${PORT}`);
  });
});
