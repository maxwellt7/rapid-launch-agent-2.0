import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Target, TrendingUp, Zap, Rocket, ArrowRight } from 'lucide-react';

  const handleGetStarted = () => {
    // Navigate to projects page
    navigate('/projectList');
  };

  const handleViewDashboard = () => {
    // If user has projects, go to dashboard
    if (projects.length > 0) {
      navigate('/project/dashboard');
    } else {
      // If no projects, go to projects page to create one
      navigate('/projectList');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            <Rocket className="w-4 h-4" />
            <span>Launch Your Business Faster</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-500 mb-4">
            Rapid Launch Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Build irresistible offers, understand your market, and launch with confidence.
            <br />
            Your AI-powered business launch assistant.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4 mb-20">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={handleViewDashboard}
            className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 transition-colors"
          >
            View Dashboard
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Offer Builder */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offer Builder</h3>
            <p className="text-gray-600">
              Analyze and optimize your offers using proven frameworks
            </p>
          </div>

          {/* Market Intelligence */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Market Intelligence</h3>
            <p className="text-gray-600">
              Understand your competitors and target audience deeply
            </p>
          </div>

          {/* Launch Strategy */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Launch Strategy</h3>
            <p className="text-gray-600">
              Get actionable steps to launch and scale your business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

