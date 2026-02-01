import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeOffer } from '../services/api';
import type { OfferData } from '../types';

export default function OfferBuilder() {
  const navigate = useNavigate();
  const { currentProject, updateOffer, updateAvatar, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OfferData>(
    currentProject?.offer || {
      targetMarket: '',
      pressingProblem: '',
      desiredOutcome: '',
      productDescription: '',
      productPromise: '',
      proofElements: '',
      pricing: '',
      guarantee: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeOffer(formData);
      const updatedData = { ...formData, analysis };
      updateOffer(updatedData);
      setFormData(updatedData);
      
      // Show success message if avatar suggestions are included
      if (analysis.suggestedAvatar) {
        alert('✅ Offer analyzed! Avatar Builder has been pre-populated with suggested avatar insights. Click "Save & Continue" to review.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    updateOffer(formData);
    
    // If we have suggested avatar data from the analysis, pre-populate avatar
    if (formData.analysisJson?.suggestedAvatar) {
      const suggested = formData.analysisJson.suggestedAvatar;
      updateAvatar({
        demographics: suggested.demographics,
        webAnalysis: {
          wants: suggested.primaryWants,
          emotions: suggested.primaryEmotions,
          beliefs: suggested.primaryBeliefs,
          dominantEmotion: suggested.dominantEmotion,
        },
        empathyMap: {
          seeing: [''],
          hearing: [''],
          saying: [''],
          thinking: [''],
          feeling: [''],
          doing: [''],
        },
        goalsGrid: {
          painsAndFrustrations: [''],
          fearsAndImplications: [''],
          goalsAndDesires: [''],
          dreamsAndAspirations: [''],
        },
        primaryCurrency: suggested.primaryCurrency,
        millionDollarMessage: suggested.millionDollarMessage,
      });
    }
    
    setCurrentStep(2);
    navigate('/project/avatar');
  };

  const isFormValid = formData.targetMarket && formData.pressingProblem && formData.productDescription;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Target className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Offer Builder</h1>
        </div>
        <p className="text-gray-600">
          Analyze your offer using the Irresistible Offer Equation. We'll evaluate essential components and provide 10 strategic improvements.
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Market */}
        <div className="card">
          <label className="label">Target Market *</label>
          <input
            type="text"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            placeholder="e.g., B2B SaaS founders with $100K-$1M ARR"
            className="input"
          />
        </div>

        {/* Pressing Problem */}
        <div className="card">
          <label className="label">Pressing Problem *</label>
          <textarea
            name="pressingProblem"
            value={formData.pressingProblem}
            onChange={handleChange}
            placeholder="What urgent problem does your target market face?"
            className="textarea"
          />
        </div>

        {/* Desired Outcome */}
        <div className="card">
          <label className="label">Desired Outcome</label>
          <textarea
            name="desiredOutcome"
            value={formData.desiredOutcome}
            onChange={handleChange}
            placeholder="What transformation do they seek?"
            className="textarea"
          />
        </div>

        {/* Product Description */}
        <div className="card">
          <label className="label">Product/Service Description *</label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Describe your product or service in detail"
            className="textarea"
          />
        </div>

        {/* Product Promise */}
        <div className="card">
          <label className="label">Core Promise</label>
          <input
            type="text"
            name="productPromise"
            value={formData.productPromise}
            onChange={handleChange}
            placeholder="e.g., 10X your leads in 90 days or your money back"
            className="input"
          />
        </div>

        {/* Proof Elements */}
        <div className="card">
          <label className="label">Proof Elements</label>
          <textarea
            name="proofElements"
            value={formData.proofElements}
            onChange={handleChange}
            placeholder="Testimonials, case studies, reviews, credentials, statistics..."
            className="textarea"
          />
        </div>

        {/* Pricing */}
        <div className="card">
          <label className="label">Pricing & Payment Options</label>
          <input
            type="text"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            placeholder="e.g., $997 one-time or 3 payments of $349"
            className="input"
          />
        </div>

        {/* Guarantee */}
        <div className="card">
          <label className="label">Guarantee / Risk Reversal</label>
          <textarea
            name="guarantee"
            value={formData.guarantee}
            onChange={handleChange}
            placeholder="What guarantee do you offer to reduce buyer risk?"
            className="textarea"
          />
        </div>

        {/* Analysis Results */}
        {formData.analysisJson?.eyoScores && (
          <div className="card bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Easy Yes Offer Analysis Complete ✓</h3>

            {/* EYO Score Summary */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-green-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Overall EYO Score</h4>
                <span className="text-3xl font-bold text-green-600">
                  {formData.analysisJson.eyoScores.totalScore}/50
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${(formData.analysisJson.eyoScores.totalScore / 50) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {formData.analysisJson.eyoScores.totalScore >= 40 && "Excellent! This is a strong Easy Yes Offer."}
                {formData.analysisJson.eyoScores.totalScore >= 30 && formData.analysisJson.eyoScores.totalScore < 40 && "Good foundation. A few improvements will make this exceptional."}
                {formData.analysisJson.eyoScores.totalScore >= 20 && formData.analysisJson.eyoScores.totalScore < 30 && "Moderate score. Focus on the criteria below to strengthen your offer."}
                {formData.analysisJson.eyoScores.totalScore < 20 && "Needs work. Review each criterion carefully."}
              </p>
            </div>

            {/* Individual EYO Criteria */}
            <div className="space-y-4">
              {[
                { key: 'clarityOfOutcome', label: 'Clarity of Outcome', description: 'How clear is the outcome?' },
                { key: 'gravityOfProblem', label: 'Gravity of Problem', description: 'How serious is the problem?' },
                { key: 'beliefInDiagnosis', label: 'Belief in Diagnosis', description: 'Do they believe your diagnosis?' },
                { key: 'naturalFit', label: 'Natural Fit', description: 'Is this a natural fit?' },
                { key: 'clearOffer', label: 'Clear Offer', description: 'Is the offer clear and simple?' },
              ].map(({ key, label, description }) => {
                const score = formData.analysisJson?.eyoScores[key as keyof typeof formData.analysisJson.eyoScores];
                if (typeof score === 'object' && score !== null && 'score' in score) {
                  return (
                    <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{label}</h5>
                          <p className="text-sm text-gray-500">{description}</p>
                        </div>
                        <span className={`text-2xl font-bold ${
                          score.score >= 8 ? 'text-green-600' :
                          score.score >= 6 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {score.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{score.reasoning}</p>

                      {score.strengths && score.strengths.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-green-700 mb-1">✓ Strengths:</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4">
                            {score.strengths.map((strength: string, idx: number) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {score.weaknesses && score.weaknesses.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-red-700 mb-1">Areas to Improve:</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4">
                            {score.weaknesses.map((weakness: string, idx: number) => (
                              <li key={idx}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Recommendations */}
            {formData.analysisJson?.recommendations && formData.analysisJson.recommendations.length > 0 && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Strategic Recommendations</h4>
                <div className="space-y-4">
                  {formData.analysisJson.recommendations.map((rec, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {idx + 1}. {rec.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                        <span className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                          rec.implementation.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.implementation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.implementation.priority} priority
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Impact:</span> +{rec.scoreImpact.change} points
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span> {rec.implementation.difficulty}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {rec.implementation.timeRequired}
                        </div>
                      </div>
                      {rec.specificActions && rec.specificActions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">Actions:</p>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4">
                            {rec.specificActions.map((action: string, actionIdx: number) => (
                              <li key={actionIdx} className="list-disc">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={!isFormValid || loading}
            className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                <span>Analyze Offer</span>
              </>
            )}
          </button>
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <span>Save & Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

