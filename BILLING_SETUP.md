# Billing Setup Guide

This guide explains how to set up Clerk Billing for your Rapid Launch Agent application.

## Overview

The billing feature has been implemented to redirect users to a pricing page after signup. Users can then subscribe to plans and access premium features.

## Setup Steps

### 1. Enable Billing in Clerk Dashboard

1. Navigate to [Clerk Dashboard Billing Settings](https://dashboard.clerk.com/~/billing/settings)
2. Click **Enable Billing** for your application
3. Choose a payment gateway:
   - **Clerk Development Gateway**: For development/testing (uses shared test Stripe account)
   - **Your Own Stripe Account**: For production (requires Stripe account setup)

### 2. Create Subscription Plans

1. Go to [Clerk Dashboard Plans](https://dashboard.clerk.com/~/billing/plans)
2. Select the **Plans for Users** tab (for B2C billing)
3. Click **Add Plan** to create subscription plans
4. Configure each plan:
   - Plan name (e.g., "Basic", "Pro", "Enterprise")
   - Pricing (monthly/yearly)
   - Billing frequency
   - Features (see next step)

### 3. Add Features to Plans

1. While creating or editing a plan, add features in the **Features** section
2. Features represent entitlements (e.g., "premium_access", "unlimited_projects")
3. You can also add features later by:
   - Going to the Plans page
   - Selecting a plan
   - Clicking **Add Feature** in the Features section

### 4. Configure Plan Visibility

- Toggle **Publicly available** to control if plans appear in Clerk components
- Publicly available plans will show in the UserProfile billing section

## How It Works

### User Flow

1. **Sign Up**: User signs up via Clerk authentication
2. **Redirect**: After signup, user is redirected to `/pricing` page
3. **Subscribe**: User views available plans and subscribes via Clerk's billing interface
4. **Access**: User gains access to premium features based on their plan

### Implementation Details

- **Post-Signup Redirect**: Configured in `src/main.tsx` with `afterSignUpUrl="/pricing"`
- **Pricing Page**: Located at `src/pages/Pricing.tsx` - uses Clerk's `UserProfile` component with billing tab
- **Subscription Check**: `src/pages/Home.tsx` checks for subscription and redirects to pricing if needed
- **Subscription Component**: `src/components/SubscriptionCheck.tsx` can be used to gate features

### Checking Subscription Status

The app checks subscription status via user metadata:
- `user.publicMetadata.subscriptionStatus === 'active'`
- `user.publicMetadata.plan` (plan name)
- `user.publicMetadata.features` (array of feature names)

### Gating Features

You can gate features using the `SubscriptionCheck` component:

```tsx
import SubscriptionCheck from '../components/SubscriptionCheck';

<SubscriptionCheck requiredPlan="pro">
  <PremiumContent />
</SubscriptionCheck>
```

Or check directly in components:

```tsx
const { user } = useUser();
const hasSubscription = user?.publicMetadata?.subscriptionStatus === 'active';
```

## Pricing Page

The pricing page (`/pricing`) displays:
- Available subscription plans
- Plan features and pricing
- Subscription management interface
- Payment method management

Users can:
- View all available plans
- Subscribe to a plan
- Upgrade/downgrade their current plan
- Cancel their subscription
- Update payment methods

## Testing

### Development Testing

1. Use Clerk Development Gateway (no Stripe account needed)
2. Create test plans in Clerk Dashboard
3. Test signup flow → should redirect to pricing
4. Subscribe to a test plan
5. Verify subscription status in user metadata

### Production Testing

1. Set up your own Stripe account
2. Configure Stripe account in Clerk Dashboard
3. Create production plans
4. Test with real payment methods (use Stripe test cards)

## Important Notes

- **Billing is in Beta**: Clerk Billing APIs are experimental and may change
- **Pin SDK Versions**: Recommended to pin Clerk SDK versions to avoid breaking changes
- **Stripe Integration**: Clerk uses Stripe only for payment processing, not for plan management
- **Plan Management**: All plans are managed in Clerk Dashboard, not Stripe
- **Cost**: Clerk Billing costs 0.7% per transaction plus Stripe fees

## Troubleshooting

### Plans Not Showing

- Ensure billing is enabled in Clerk Dashboard
- Check that plans are marked as "Publicly available"
- Verify you're using the correct Clerk instance (dev vs production)

### Subscription Status Not Updating

- Subscription status is stored in user metadata
- May take a few seconds to update after subscription
- Check Clerk Dashboard to verify subscription status

### Redirect Not Working

- Verify `afterSignUpUrl` is set in `ClerkProvider`
- Check that `/pricing` route exists in your app
- Ensure user is authenticated before redirect

## Next Steps

1. Enable billing in Clerk Dashboard
2. Create your subscription plans
3. Add features to plans
4. Test the signup → pricing → subscribe flow
5. Configure feature gating for premium content

## Resources

- [Clerk Billing Documentation](https://clerk.com/docs/billing)
- [Clerk Billing for B2C](https://clerk.com/docs/guides/billing/for-b2c)
- [Clerk Dashboard](https://dashboard.clerk.com)

