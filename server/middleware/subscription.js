import { userDB } from '../config/database.js';

/**
 * Subscription middleware
 * Checks if user has an active subscription before allowing access
 */
export async function requireSubscription(req, res, next) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    // Check subscription status
    const subscription = await userDB.checkSubscription(userId);

    if (!subscription.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        subscriptionUrl: '/pricing',
        currentStatus: subscription.status,
      });
    }

    // Add subscription info to request for use in routes
    req.subscription = subscription;

    next();
  } catch (error) {
    console.error('❌ Subscription check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify subscription',
      code: 'SUBSCRIPTION_CHECK_FAILED',
    });
  }
}

/**
 * Check subscription but don't block
 * Adds subscription info to request if available
 */
export async function checkSubscription(req, res, next) {
  try {
    const userId = req.auth?.userId;

    if (userId) {
      const subscription = await userDB.checkSubscription(userId);
      req.subscription = subscription;
    }

    next();
  } catch (error) {
    console.error('⚠️  Subscription check warning:', error);
    // Continue anyway
    next();
  }
}

/**
 * Development bypass for subscription checks
 * USE ONLY IN DEVELOPMENT - Never in production
 */
export function bypassSubscription(req, res, next) {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_SUBSCRIPTION === 'true') {
    console.warn('⚠️  BYPASSING SUBSCRIPTION CHECK - DEVELOPMENT MODE');
    req.subscription = {
      isActive: true,
      status: 'active',
    };
  }

  next();
}

export default requireSubscription;
