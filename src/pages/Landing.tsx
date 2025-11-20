import { Rocket, Target, Users, TrendingUp, Brain, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignUpButton } from '@clerk/clerk-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Rapid Launch Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You're sitting a $1m+ idea. The Rapid Launch Agent turns your million dollar idea into a million dollar business in 72 hours.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </SignUpButton>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Offer Analysis</h3>
            <p className="text-gray-600 text-sm">
              Deep analysis using the Irresistible Offer Equation with 10 strategic improvements
            </p>
          </div>
          <div className="card text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Avatar Builder</h3>
            <p className="text-gray-600 text-sm">
              WEB analysis (Wants, Emotions, Beliefs) with empathy mapping and psychology profiling
            </p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Competitor Intel</h3>
            <p className="text-gray-600 text-sm">
              Forensic market analysis with positioning angles and distribution strategies
            </p>
          </div>
          <div className="card text-center">
            <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Manifold</h3>
            <p className="text-gray-600 text-sm">
              14-node workflow generating deep psychological insights and copywriting frameworks
            </p>
          </div>
          <div className="card text-center">
            <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Launch Document</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive 38+ section marketing brief ready for team implementation
            </p>
          </div>
          <div className="card text-center bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <Rocket className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Complete System</h3>
            <p className="text-sm">
              Everything you need to launch with confidence and precision
            </p>
          </div>
        </div>
    </div>
  );
}

