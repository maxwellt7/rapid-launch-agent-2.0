/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    userId: req.auth?.userId,
  });

  // Clerk authentication errors
  if (err.name === 'ClerkAuthenticationError' || err.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
    });
  }

  // Clerk authorization errors
  if (err.name === 'ClerkAuthorizationError' || err.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      code: 'FORBIDDEN',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.details || err.message,
    });
  }

  // Database errors
  if (err.code?.startsWith('23')) {
    // PostgreSQL constraint violations
    return res.status(400).json({
      success: false,
      error: 'Database constraint violation',
      code: 'DB_CONSTRAINT_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Rate limit errors (should be handled by rate limiter, but just in case)
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  // Default error
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details,
    }),
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
  });
}

export default errorHandler;
