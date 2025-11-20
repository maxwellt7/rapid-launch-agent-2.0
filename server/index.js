import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root FIRST before importing routes
dotenv.config({ path: join(__dirname, '..', '.env') });

// Now import everything else after env is loaded
import express from 'express';
import cors from 'cors';
import { analyzeOfferRoute } from './routes/offerAnalysis.js';
import { analyzeAvatarRoute } from './routes/avatarAnalysis.js';
import { analyzeCompetitorsRoute } from './routes/competitorAnalysis.js';
import { runManifoldRoute } from './routes/manifoldWorkflow.js';
import { generateLaunchDocRoute } from './routes/launchDocument.js';
import { queryRoute } from './routes/query.js';
import { exportRoute } from './routes/export.js';
import { getGenerationProgressRoute, getLatestGenerationRoute } from './routes/progress.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
// Handle multiple origins properly (comma-separated string or array)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['*'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // If CORS_ORIGIN is '*', allow all origins
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rapid Launch Agent API is running' });
});

// Routes
app.post('/api/analyze/offer', analyzeOfferRoute);
app.post('/api/analyze/avatar', analyzeAvatarRoute);
app.post('/api/analyze/competitors', analyzeCompetitorsRoute);
app.post('/api/analyze/manifold', runManifoldRoute);
app.post('/api/generate/launch-document', generateLaunchDocRoute);
app.get('/api/generation/progress/:generationId', getGenerationProgressRoute);
app.get('/api/generation/latest/:projectId', getLatestGenerationRoute);
app.post('/api/query', queryRoute);
app.post('/api/export/:format', exportRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Rapid Launch Agent server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 Using Claude Sonnet 4.5 for AI analysis`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not found in environment variables');
  }
});

