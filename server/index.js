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

// Middleware
import { requireAuth } from './middleware/auth.js';
import { requireSubscription, bypassSubscription } from './middleware/subscription.js';
import { apiLimiter, generationLimiter, webhookLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routes
import { analyzeOfferRoute } from './routes/offerAnalysis.js';
import { applyImprovementsRoute } from './routes/offerImprovement.js';
import { analyzeAvatarRoute } from './routes/avatarAnalysis.js';
import { analyzeCompetitorsRoute } from './routes/competitorAnalysis.js';
import { runManifoldRoute } from './routes/manifoldWorkflow.js';
import { generateLaunchDocRoute } from './routes/launchDocument.js';
import { generateContentRoute, getContentRoute, listContentRoute } from './routes/contentGeneration.js';
import { queryRoute } from './routes/query.js';
import { exportRoute } from './routes/export.js';
import { getGenerationProgressRoute, getLatestGenerationRoute } from './routes/progress.js';
import { clerkWebhookHandler, getSubscriptionStatus, verifyToken } from './routes/auth.js';

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

// Public routes (no authentication required)
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Rapid Launch Agent 2.0 (Easy Yes System) API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Clerk webhook (rate limited but no auth)
app.post('/api/webhooks/clerk', webhookLimiter, clerkWebhookHandler);

// Protected routes (authentication required)
// ============================================

// Auth verification routes
app.get('/api/auth/verify', requireAuth, verifyToken);
app.get('/api/auth/subscription', requireAuth, getSubscriptionStatus);

// Development bypass (only in dev mode with env var)
if (process.env.NODE_ENV === 'development') {
  app.use('/api', bypassSubscription);
}

// Analysis routes (require auth + subscription + rate limiting)
app.post('/api/analyze/offer', requireAuth, requireSubscription, apiLimiter, generationLimiter, analyzeOfferRoute);
app.post('/api/offer/apply-improvements', requireAuth, requireSubscription, apiLimiter, generationLimiter, applyImprovementsRoute);
app.post('/api/analyze/avatar', requireAuth, requireSubscription, apiLimiter, generationLimiter, analyzeAvatarRoute);
app.post('/api/analyze/competitors', requireAuth, requireSubscription, apiLimiter, generationLimiter, analyzeCompetitorsRoute);
app.post('/api/analyze/manifold', requireAuth, requireSubscription, apiLimiter, generationLimiter, runManifoldRoute);

// Generation routes (require auth + subscription + rate limiting)
app.post('/api/generate/launch-document', requireAuth, requireSubscription, apiLimiter, generationLimiter, generateLaunchDocRoute);
app.post('/api/generate/content', requireAuth, requireSubscription, apiLimiter, generationLimiter, generateContentRoute);
app.get('/api/content/:contentId', requireAuth, apiLimiter, getContentRoute);
app.get('/api/content/project/:projectId', requireAuth, apiLimiter, listContentRoute);
app.get('/api/generation/progress/:generationId', requireAuth, apiLimiter, getGenerationProgressRoute);
app.get('/api/generation/latest/:projectId', requireAuth, apiLimiter, getLatestGenerationRoute);

// Query route (require auth + subscription)
app.post('/api/query', requireAuth, requireSubscription, apiLimiter, queryRoute);

// Export routes (require auth + subscription)
app.post('/api/export/:format', requireAuth, requireSubscription, apiLimiter, exportRoute);

// Error handling
// ============================================

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Rapid Launch Agent server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 Using Claude Sonnet 4.5 for AI analysis`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not found in environment variables');
  }
});

