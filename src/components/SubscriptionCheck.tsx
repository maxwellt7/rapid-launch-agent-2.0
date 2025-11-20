import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredPlan?: string;
  requiredFeature?: string;
}

/**
 * Component that checks if user has a subscription/plan and redirects if not
 * Works with Clerk's billing system
 * This should be used to gate access to premium features
 */
export default function SubscriptionCheck({ 
  children, 
  redirectTo = '/pricing',
  requiredPlan,
  requiredFeature 
}: SubscriptionCheckProps) {
  const navigate = useNavigate();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded || !userId || !user) return;

    // Clerk stores subscription info in user metadata
    // Check for subscription status in publicMetadata (Clerk's standard location)
    const subscriptionStatus = user.publicMetadata?.subscriptionStatus;
    const userPlan = user.publicMetadata?.plan as string | undefined;
    const userFeatures = (user.publicMetadata?.features as string[]) || [];

    // Check for required plan
    if (requiredPlan) {
      if (userPlan !== requiredPlan && subscriptionStatus !== 'active') {
        navigate(redirectTo, { replace: true });
        return;
      }
    }

    // Check for required feature
    if (requiredFeature) {
      if (!userFeatures.includes(requiredFeature)) {
        navigate(redirectTo, { replace: true });
        return;
      }
    }

    // If no specific requirement, check for any active subscription
    if (!requiredPlan && !requiredFeature) {
      if (subscriptionStatus !== 'active' && !userPlan) {
        // Only redirect if we're not already on the pricing page
        if (window.location.pathname !== '/pricing') {
          navigate(redirectTo, { replace: true });
        }
      }
    }
  }, [isLoaded, userId, user, navigate, redirectTo, requiredPlan, requiredFeature]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

