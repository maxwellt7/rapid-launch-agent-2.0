import { UserProfile } from '@clerk/clerk-react';
import { Rocket, CreditCard, Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to unlock the full potential of Rapid Launch Agent
          </p>
        </div>

        {/* User Profile with Billing - Clerk will show available plans here */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Manage Your Subscription</h2>
          </div>
          <p className="text-gray-600 mb-6">
            View available plans and manage your subscription below. You can upgrade, downgrade, or cancel at any time.
          </p>
          <div className="border-t border-gray-200 pt-6">
            <UserProfile 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0",
                  navbar: "hidden", // Hide navbar, just show billing
                },
                layout: {
                  showOptionalFields: false,
                }
              }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-3 text-left">
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Secure payment processing via Stripe</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Cancel anytime, no questions asked</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Instant access to all features</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">24/7 customer support</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Need help? Contact us at <a href="mailto:max@growthgod.io" className="text-primary-600 hover:underline font-medium">max@growthgod.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}

