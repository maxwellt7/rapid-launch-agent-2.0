import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 20, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Rapid Launch Agent ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of rapidlaunchagent.com, related software, services, applications, tools, and any associated content (collectively, the "Service").
            </p>
            <p className="text-gray-700 mb-6">
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not access or use the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eligibility</h2>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old and capable of forming a binding contract to use the Service. By using the Service, you represent that you meet these requirements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Rapid Launch Agent provides AI-assisted tools that help users generate marketing assets, launch workflows, strategic plans, and related deliverables. Features may include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>AI-driven content generation</li>
              <li>Workflow automation</li>
              <li>Strategy recommendations</li>
              <li>Data-driven optimization tools</li>
              <li>Access to dashboards, templates, or proprietary frameworks</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We may update or modify the Service at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Accounts</h2>
            <p className="text-gray-700 mb-4">You may need to create an account to use certain features. You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Keep your login credentials secure</li>
              <li>Accept responsibility for all activity under your account</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We may suspend or terminate accounts that violate these Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription, Payments, and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Access to certain features may require a paid subscription.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>All fees are stated at checkout and may be updated periodically.</li>
              <li>Subscriptions renew automatically unless cancelled.</li>
              <li>You may cancel at any time, but payments already made are non-refundable, including partial billing periods.</li>
              <li>If refunds are offered under a specific promotion, they will follow the terms of that promotion only.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Use the Service for illegal, harmful, or fraudulent purposes</li>
              <li>Attempt to reverse engineer, copy, or reproduce the system</li>
              <li>Use AI-generated outputs to violate laws or create harmful content</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We may remove content or restrict access for violations of this policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All Service software, features, design, workflows, proprietary content, and branding are owned by us or licensed to us.
            </p>
            <p className="text-gray-700 mb-4">
              You retain ownership of input data you provide.
              You receive a royalty-free license to use AI-generated outputs for personal or commercial use, except where otherwise prohibited.
            </p>
            <p className="text-gray-700 mb-4">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Sell the Service itself</li>
              <li>Claim ownership of proprietary models or systems</li>
              <li>Train models using our outputs without written consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. User Content</h2>
            <p className="text-gray-700 mb-4">
              By using the Service, you grant us a license to process your content solely for the purpose of operating, improving, and securing the Service.
            </p>
            <p className="text-gray-700 mb-4 font-semibold">
              We do not sell user data or share it with third parties for advertising.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. AI Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              Outputs generated by the Service may include errors, inaccuracies, or unexpected results.
            </p>
            <p className="text-gray-700 mb-4">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>AI content is provided "as-is"</li>
              <li>You are solely responsible for verifying accuracy</li>
              <li>We make no guarantees of business performance, revenue, or specific outcomes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability for any claim shall not exceed the amount paid by you in the past 12 months</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Some jurisdictions do not allow certain limitations. If those rules apply to you, some limits may not apply.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
            <p className="text-gray-700 mb-4">We may suspend or terminate your access if:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>You violate these Terms</li>
              <li>You misuse the Service</li>
              <li>We discontinue part or all of the Service</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Upon termination, your right to use the Service ends immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles.
            </p>
            <p className="text-gray-700 mb-4">
              Any disputes shall be resolved exclusively in courts located in Florida.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Modifications</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms at any time. Continued use after changes constitutes acceptance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, contact:{' '}
              <a href="mailto:max@growthgod.io" className="text-primary-600 hover:text-primary-700 underline">
                max@growthgod.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

