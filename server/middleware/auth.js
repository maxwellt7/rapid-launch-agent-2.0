import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

/**
 * Authentication middleware using Clerk
 * Verifies JWT tokens and adds user info to request
 */
export const requireAuth = ClerkExpressRequireAuth({
  // Add any custom Clerk configuration here
  onError: (error) => {
    console.error('❌ Auth error:', error);
  },
});

/**
 * Optional authentication
 * Adds user info if token is present, but doesn't require it
 */
export function optionalAuth(req, res, next) {
  // Try to extract user from Clerk session
  // If no valid session, continue without blocking
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  // Use Clerk's auth middleware but don't block on failure
  requireAuth(req, res, (err) => {
    // Continue regardless of auth status
    next();
  });
}

export default requireAuth;
