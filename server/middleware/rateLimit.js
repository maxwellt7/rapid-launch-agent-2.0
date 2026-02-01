import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per minute per user
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,           // 1 minute
  max: 100,                       // 100 requests per window
  message: 'Too many requests from this user, please try again later.',
  standardHeaders: true,          // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,           // Disable `X-RateLimit-*` headers

  // Key generator (per user)
  keyGenerator: (req) => {
    return req.auth?.userId || req.ip;
  },

  // Skip rate limiting in development if configured
  skip: (req) => {
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  },

  // Custom handler
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

/**
 * Generation-specific rate limiter
 * 10 generations per hour per user
 */
export const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,      // 1 hour
  max: 10,                        // 10 generations per hour

  keyGenerator: (req) => {
    return req.auth?.userId || req.ip;
  },

  skip: (req) => {
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Generation limit exceeded. Please wait before generating more content.',
      code: 'GENERATION_LIMIT_EXCEEDED',
      limit: 10,
      window: '1 hour',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

/**
 * Webhook rate limiter (less strict)
 * 1000 requests per hour per IP
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,      // 1 hour
  max: 1000,                      // 1000 requests per hour

  keyGenerator: (req) => req.ip,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Webhook rate limit exceeded',
    });
  },
});

export default {
  apiLimiter,
  generationLimiter,
  webhookLimiter,
};
