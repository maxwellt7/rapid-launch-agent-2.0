import { userDB } from '../config/database.js';

/**
 * Clerk Webhook Handler
 * Handles user lifecycle and subscription events from Clerk
 */
export async function clerkWebhookHandler(req, res) {
  try {
    const event = req.body;

    console.log('📨 Clerk webhook received:', event.type);

    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;

      case 'user.updated':
        await handleUserUpdated(event.data);
        break;

      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;

      // Subscription events (if using Clerk for subscriptions)
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;

      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data);
        break;

      default:
        console.log('⚠️  Unhandled webhook event type:', event.type);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('❌ Clerk webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(userData) {
  console.log('✅ Creating user:', userData.id);

  const user = {
    id: userData.id,
    email: userData.email_addresses?.[0]?.email_address || '',
    fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
  };

  await userDB.upsert(user);
  console.log('✅ User created in database:', user.id);
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(userData) {
  console.log('📝 Updating user:', userData.id);

  const user = {
    id: userData.id,
    email: userData.email_addresses?.[0]?.email_address || '',
    fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
  };

  await userDB.upsert(user);
  console.log('✅ User updated in database:', user.id);
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(userData) {
  console.log('🗑️  User deleted:', userData.id);
  // User deletion cascades in database due to ON DELETE CASCADE
  // No action needed here
}

/**
 * Handle subscription.created event
 */
async function handleSubscriptionCreated(subscriptionData) {
  console.log('💳 Subscription created:', subscriptionData);

  const userId = subscriptionData.user_id || subscriptionData.userId;

  await userDB.updateSubscription(userId, {
    tier: subscriptionData.plan?.name || 'active',
    status: 'active',
    startedAt: new Date(subscriptionData.created_at || Date.now()).toISOString(),
    expiresAt: subscriptionData.current_period_end
      ? new Date(subscriptionData.current_period_end).toISOString()
      : null,
  });

  console.log('✅ Subscription activated for user:', userId);
}

/**
 * Handle subscription.updated event
 */
async function handleSubscriptionUpdated(subscriptionData) {
  console.log('📝 Subscription updated:', subscriptionData);

  const userId = subscriptionData.user_id || subscriptionData.userId;

  await userDB.updateSubscription(userId, {
    tier: subscriptionData.plan?.name || 'active',
    status: subscriptionData.status || 'active',
    startedAt: new Date(subscriptionData.created_at || Date.now()).toISOString(),
    expiresAt: subscriptionData.current_period_end
      ? new Date(subscriptionData.current_period_end).toISOString()
      : null,
  });

  console.log('✅ Subscription updated for user:', userId);
}

/**
 * Handle subscription.deleted event
 */
async function handleSubscriptionDeleted(subscriptionData) {
  console.log('❌ Subscription deleted:', subscriptionData);

  const userId = subscriptionData.user_id || subscriptionData.userId;

  await userDB.updateSubscription(userId, {
    tier: 'none',
    status: 'canceled',
    startedAt: null,
    expiresAt: null,
  });

  console.log('✅ Subscription canceled for user:', userId);
}

/**
 * Get subscription status for current user
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const subscription = await userDB.checkSubscription(userId);

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('❌ Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription status',
    });
  }
}

/**
 * Verify JWT token (for debugging/testing)
 */
export async function verifyToken(req, res) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or missing token',
      });
    }

    const user = await userDB.getById(userId);

    res.json({
      success: true,
      data: {
        userId,
        user,
      },
    });
  } catch (error) {
    console.error('❌ Verify token error:', error);
    res.status(500).json({
      success: false,
      error: 'Token verification failed',
    });
  }
}
