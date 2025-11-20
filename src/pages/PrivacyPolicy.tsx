import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 20, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy explains how Rapid Launch Agent ("we," "our," or "us") collects, uses, and protects your information when you access rapidlaunchagent.com and related services ("Service").
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">a. Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Account information (name, email, password)</li>
              <li>Payment information (processed securely via third-party providers)</li>
              <li>Content and data you upload or input into the Service</li>
              <li>Communication with support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">b. Information We Automatically Collect</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Device and browser information</li>
              <li>Log data (IP address, timestamps, pages visited)</li>
              <li>Cookies and tracking technologies to improve user experience</li>
              <li>Usage data (features used, frequency, performance metrics)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">c. Third-Party Information</h3>
            <p className="text-gray-700 mb-4">
              We may receive anonymized analytics from external tools (e.g., Stripe, analytics platforms).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide and maintain the Service</li>
              <li>Improve system performance and user experience</li>
              <li>Personalize outputs and recommendations</li>
              <li>Process payments and authentication</li>
              <li>Communicate updates or support responses</li>
              <li>Prevent fraud and protect security</li>
            </ul>
            <p className="text-gray-700 mb-4 font-semibold">
              We do not sell or share your information for advertising purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How AI Handles Your Data</h2>
            <p className="text-gray-700 mb-4">Your input data may be processed by AI systems to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Generate outputs</li>
              <li>Personalize recommendations</li>
              <li>Improve system behavior and accuracy</li>
            </ul>
            <p className="text-gray-700 mb-4">
              All training and processing occurs within secure, controlled environments.
              We do not use your private data to train public models.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Sharing of Information</h2>
            <p className="text-gray-700 mb-4">We may share your information only with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Service providers (payment processors, hosting providers)</li>
              <li>Legal authorities when required by law</li>
              <li>Internal team or contractors for operations under strict confidentiality</li>
            </ul>
            <p className="text-gray-700 mb-4 font-semibold">
              We do not share data with data brokers or advertisers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-4">We retain data only as long as necessary to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide the Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You may request deletion of your data by contacting support.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Security</h2>
            <p className="text-gray-700 mb-4">
              We use reasonable technical, administrative, and organizational measures to protect your information.
              However, no system is entirely secure — and we cannot guarantee absolute protection.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-4">Depending on your location, you may have rights including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Access to your data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your personal data</li>
              <li>Portability requests</li>
              <li>Limiting certain processing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise rights, contact support.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Functionality</li>
              <li>Analytics</li>
              <li>User preferences</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You may disable cookies in your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              The Service is not intended for users under 18.
              We do not knowingly collect data from minors.
              If you believe data was collected, contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically.
              Continued use after changes signifies acceptance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact</h2>
            <p className="text-gray-700 mb-4">
              For questions or privacy requests, contact:{' '}
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

