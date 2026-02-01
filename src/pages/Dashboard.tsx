import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import {
  LayoutDashboard,
  Target,
  Users,
  FileText,
  Video,
  Mail,
  Send,
  BarChart3,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentProject = useProjectStore((state) => state.currentProject);

  // Extract EYO scores if available
  const eyoScores = currentProject?.offer?.analysisJson?.eyoScores;
  const beliefs = currentProject?.avatar?.analysisJson?.sixBeliefs;

  // Content generation options
  const contentTypes = [
    {
      id: 'blur',
      name: 'BLUR Campaign',
      description: 'Cold email lead generation',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'ad_script',
      name: 'Ad Scripts',
      description: 'Video ads (FB, YT, TikTok)',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'vsl',
      name: 'VSL Script',
      description: 'Video sales letter',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'landing_page',
      name: 'Landing Page',
      description: 'Sales page copy',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'email_sequence',
      name: 'Email Sequence',
      description: 'Nurture & sales emails',
      icon: Send,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const handleGenerateContent = (contentTypeId: string) => {
    // Navigate to content generation page
    navigate(`/project/content/${contentTypeId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Analytics, insights, and content generation hub
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">EYO Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {eyoScores?.totalScore || '-'}<span className="text-base text-gray-500">/50</span>
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Belief Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {beliefs ? ((
                  (beliefs.outcome?.currentState || 0) +
                  (beliefs.identity?.currentState || 0) +
                  (beliefs.problem?.currentState || 0) +
                  (beliefs.solution?.currentState || 0) +
                  (beliefs.product?.currentState || 0) +
                  (beliefs.credibility?.currentState || 0)
                ) / 6).toFixed(1) : '-'}
                <span className="text-base text-gray-500">/10</span>
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Content Generated</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentProject?.offer && currentProject?.avatar ? '60' : '0'}%
              </p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* EYO Scores Table */}
      {eyoScores && (
        <div className="bg-white rounded-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">EYO Offer Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Criterion</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Strengths</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Weaknesses</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Clarity of Outcome</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {eyoScores.clarityOfOutcome.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.clarityOfOutcome.strengths?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.clarityOfOutcome.weaknesses?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      eyoScores.clarityOfOutcome.score >= 8 ? 'bg-green-100 text-green-700' :
                      eyoScores.clarityOfOutcome.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.clarityOfOutcome.score >= 8 ? 'Strong' :
                       eyoScores.clarityOfOutcome.score >= 5 ? 'Moderate' : 'Weak'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Gravity of Problem</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {eyoScores.gravityOfProblem.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.gravityOfProblem.strengths?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.gravityOfProblem.weaknesses?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      eyoScores.gravityOfProblem.score >= 8 ? 'bg-green-100 text-green-700' :
                      eyoScores.gravityOfProblem.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.gravityOfProblem.score >= 8 ? 'Strong' :
                       eyoScores.gravityOfProblem.score >= 5 ? 'Moderate' : 'Weak'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Belief in Diagnosis</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {eyoScores.beliefInDiagnosis.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.beliefInDiagnosis.strengths?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.beliefInDiagnosis.weaknesses?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      eyoScores.beliefInDiagnosis.score >= 8 ? 'bg-green-100 text-green-700' :
                      eyoScores.beliefInDiagnosis.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.beliefInDiagnosis.score >= 8 ? 'Strong' :
                       eyoScores.beliefInDiagnosis.score >= 5 ? 'Moderate' : 'Weak'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Natural Fit</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {eyoScores.naturalFit.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.naturalFit.strengths?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.naturalFit.weaknesses?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      eyoScores.naturalFit.score >= 8 ? 'bg-green-100 text-green-700' :
                      eyoScores.naturalFit.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.naturalFit.score >= 8 ? 'Strong' :
                       eyoScores.naturalFit.score >= 5 ? 'Moderate' : 'Weak'}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Clear Offer</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {eyoScores.clearOffer.score}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.clearOffer.strengths?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {eyoScores.clearOffer.weaknesses?.slice(0, 2).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      eyoScores.clearOffer.score >= 8 ? 'bg-green-100 text-green-700' :
                      eyoScores.clearOffer.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.clearOffer.score >= 8 ? 'Strong' :
                       eyoScores.clearOffer.score >= 5 ? 'Moderate' : 'Weak'}
                    </span>
                  </td>
                </tr>

                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900">Total Score</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      {eyoScores.totalScore}/50
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={2}>
                    {eyoScores.totalScore >= 40 ? 'Excellent - Ready to convert' :
                     eyoScores.totalScore >= 30 ? 'Good - Minor tweaks needed' :
                     eyoScores.totalScore >= 20 ? 'Fair - Significant improvement needed' :
                     'Poor - Major overhaul required'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      eyoScores.totalScore >= 40 ? 'bg-green-100 text-green-700' :
                      eyoScores.totalScore >= 30 ? 'bg-blue-100 text-blue-700' :
                      eyoScores.totalScore >= 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eyoScores.totalScore >= 40 ? 'Excellent' :
                       eyoScores.totalScore >= 30 ? 'Good' :
                       eyoScores.totalScore >= 20 ? 'Fair' : 'Poor'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6 Beliefs Table */}
      {beliefs && (
        <div className="bg-white rounded-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">6 Beliefs Framework</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Belief</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Current State</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Top Objections</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Transition State</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(beliefs).map(([key, belief]: [string, any]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {belief.currentState || 0}/10
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              belief.currentState >= 8 ? 'bg-green-500' :
                              belief.currentState >= 5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(belief.currentState || 0) * 10}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {belief.commonObjections?.slice(0, 2).join(', ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        belief.transitionState === 'transformed' ? 'bg-green-100 text-green-700' :
                        belief.transitionState === 'receptive' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {belief.transitionState || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        belief.currentState < 5 ? 'bg-red-100 text-red-700' :
                        belief.currentState < 7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {belief.currentState < 5 ? 'High' :
                         belief.currentState < 7 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Generation Hub */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Content Generation Hub</h2>
              <p className="text-sm text-gray-600 mt-1">Generate high-converting content based on your EYO analysis</p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {contentTypes.map((contentType) => {
              const Icon = contentType.icon;
              return (
                <button
                  key={contentType.id}
                  onClick={() => handleGenerateContent(contentType.id)}
                  className={`${contentType.bgColor} hover:shadow-md transition-all p-4 rounded-lg text-left border border-transparent hover:border-gray-300`}
                  disabled={!currentProject?.offer || !currentProject?.avatar}
                >
                  <div className="flex flex-col h-full">
                    <Icon className={`w-8 h-8 ${contentType.color} mb-3`} />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      {contentType.name}
                    </h3>
                    <p className="text-xs text-gray-600 flex-1">
                      {contentType.description}
                    </p>
                    {(!currentProject?.offer || !currentProject?.avatar) && (
                      <p className="text-xs text-red-600 mt-2">
                        Complete offer & avatar first
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
