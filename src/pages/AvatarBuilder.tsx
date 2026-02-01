import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Users, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeAvatar } from '../services/api';
import type { AvatarData, Demographics, WEBAnalysis, EmpathyMap, GoalsGrid } from '../types';

export default function AvatarBuilder() {
  const navigate = useNavigate();
  const { currentProject, updateAvatar, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'demographics' | 'web' | 'empathy' | 'goals'>('demographics');
  
  const [demographics, setDemographics] = useState<Demographics>(
    currentProject?.avatar?.demographics || {
      ageRange: '',
      gender: '',
      location: '',
      incomeRange: '',
      education: '',
      occupation: '',
    }
  );

  const [webAnalysis, setWebAnalysis] = useState<WEBAnalysis>(
    currentProject?.avatar?.webAnalysis || {
      wants: [''],
      emotions: [''],
      beliefs: [''],
      dominantEmotion: '',
    }
  );

  const [empathyMap, setEmpathyMap] = useState<EmpathyMap>(
    currentProject?.avatar?.empathyMap || {
      seeing: [''],
      hearing: [''],
      saying: [''],
      thinking: [''],
      feeling: [''],
      doing: [''],
    }
  );

  const [goalsGrid, setGoalsGrid] = useState<GoalsGrid>(
    currentProject?.avatar?.goalsGrid || {
      painsAndFrustrations: [''],
      fearsAndImplications: [''],
      goalsAndDesires: [''],
      dreamsAndAspirations: [''],
    }
  );

  const [primaryCurrency, setPrimaryCurrency] = useState(currentProject?.avatar?.primaryCurrency || '');
  const [millionDollarMessage, setMillionDollarMessage] = useState(currentProject?.avatar?.millionDollarMessage || '');

  const handleArrayChange = (
    setState: Function,
    field: string,
    index: number,
    value: string
  ) => {
    setState((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
    }));
  };

  const handleAddItem = (setState: Function, field: string) => {
    setState((prev: any) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const avatarData: AvatarData = {
        demographics,
        webAnalysis,
        empathyMap,
        goalsGrid,
        primaryCurrency,
        millionDollarMessage,
      };
      
      const analysis = await analyzeAvatar(avatarData);
      updateAvatar({ ...avatarData, ...analysis });
      
      // Update local state with analysis results
      if (analysis.primaryCurrency) {
        setPrimaryCurrency(analysis.primaryCurrency);
      }
      if (analysis.millionDollarMessage) {
        setMillionDollarMessage(analysis.millionDollarMessage);
      }
      if (analysis.empathyMap) {
        setEmpathyMap(analysis.empathyMap);
      }
      if (analysis.goalsGrid) {
        setGoalsGrid(analysis.goalsGrid);
      }
      
      alert('✅ Avatar analysis complete! The Empathy Map and Goals Grid have been populated with AI-generated insights. Check all fields including "Primary Currency" and "Million Dollar Message".');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const avatarData: AvatarData = {
      demographics,
      webAnalysis,
      empathyMap,
      goalsGrid,
      primaryCurrency,
      millionDollarMessage,
    };
    updateAvatar(avatarData);
    setCurrentStep(3);
    navigate('/project/competitors');
  };

  const tabs = [
    { id: 'demographics', label: 'Demographics' },
    { id: 'web', label: 'Desire Chain' },
    { id: 'empathy', label: 'Empathy Map' },
    { id: 'goals', label: 'Goals Grid' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Avatar Builder</h1>
        </div>
        <p className="text-gray-600">
          Deepest dive possible on your ideal client profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-4">
              <div>
                <label className="label">Age Range</label>
                <input
                  type="text"
                  value={demographics.ageRange}
                  onChange={(e) => setDemographics({ ...demographics, age: e.target.value })}
                  placeholder="e.g., 35-50"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Gender</label>
                <input
                  type="text"
                  value={demographics.gender}
                  onChange={(e) => setDemographics({ ...demographics, gender: e.target.value })}
                  placeholder="e.g., Male, Female, All"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={demographics.location}
                  onChange={(e) => setDemographics({ ...demographics, location: e.target.value })}
                  placeholder="e.g., Urban USA, Global"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Income Range</label>
                <input
                  type="text"
                  value={demographics.incomeRange}
                  onChange={(e) => setDemographics({ ...demographics, income: e.target.value })}
                  placeholder="e.g., $75K-$150K/year"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Education Level</label>
                <input
                  type="text"
                  value={demographics.education}
                  onChange={(e) => setDemographics({ ...demographics, education: e.target.value })}
                  placeholder="e.g., College degree"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Occupation</label>
                <input
                  type="text"
                  value={demographics.occupation}
                  onChange={(e) => setDemographics({ ...demographics, occupation: e.target.value })}
                  placeholder="e.g., Business owners, Marketers"
                  className="input"
                />
              </div>
            </div>
          )}

          {/* WEB Analysis Tab */}
          {activeTab === 'web' && (
            <div className="space-y-6">
              <div>
                <label className="label">Wants & Desires</label>
                {webAnalysis.wants.map((want, index) => (
                  <input
                    key={index}
                    type="text"
                    value={want}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'wants', index, e.target.value)}
                    placeholder="What does your prospect deeply want?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'wants')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Want
                </button>
              </div>

              <div>
                <label className="label">Emotions & Feelings</label>
                {webAnalysis.emotions.map((emotion, index) => (
                  <input
                    key={index}
                    type="text"
                    value={emotion}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'emotions', index, e.target.value)}
                    placeholder="How do they feel about their situation?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'emotions')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Emotion
                </button>
              </div>

              <div>
                <label className="label">Beliefs</label>
                {webAnalysis.beliefs.map((belief, index) => (
                  <input
                    key={index}
                    type="text"
                    value={belief}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'beliefs', index, e.target.value)}
                    placeholder="What do they believe about the problem/solution?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'beliefs')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Belief
                </button>
              </div>

              <div>
                <label className="label">Dominant Emotion</label>
                <input
                  type="text"
                  value={webAnalysis.dominantEmotion}
                  onChange={(e) => setWebAnalysis({ ...webAnalysis, dominantEmotion: e.target.value })}
                  placeholder="e.g., Frustration, Fear, Hope"
                  className="input"
                />
              </div>
            </div>
          )}

          {/* Empathy Map Tab */}
          {activeTab === 'empathy' && (
            <div className="space-y-6">
              {Object.keys(empathyMap).map((key) => (
                <div key={key}>
                  <label className="label capitalize">What are they {key}?</label>
                  {empathyMap[key as keyof EmpathyMap]?.map((item: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(setEmpathyMap, key, index, e.target.value)}
                      placeholder={`What are they ${key}?`}
                      className="input mb-2"
                    />
                  ))}
                  <button
                    onClick={() => handleAddItem(setEmpathyMap, key)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Another
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Goals Grid Tab */}
          {activeTab === 'goals' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Pains & Frustrations (Now/Away From)</label>
                {goalsGrid.painsAndFrustrations.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'painsAndFrustrations', index, e.target.value)}
                    placeholder="Current pain points..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'painsAndFrustrations')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Fears & Implications (Eventual/Away From)</label>
                {goalsGrid.fearsAndImplications.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'fearsAndImplications', index, e.target.value)}
                    placeholder="Future fears..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'fearsAndImplications')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Goals & Desires (Now/Toward)</label>
                {goalsGrid.goalsAndDesires.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'goalsAndDesires', index, e.target.value)}
                    placeholder="Immediate goals..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'goalsAndDesires')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Dreams & Aspirations (Eventual/Toward)</label>
                {goalsGrid.dreamsAndAspirations.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'dreamsAndAspirations', index, e.target.value)}
                    placeholder="Big picture dreams..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'dreamsAndAspirations')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6 Beliefs Analysis Results */}
      {currentProject?.avatar?.beliefs && (
        <div className="card bg-blue-50 border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">6 Beliefs Analysis ✓</h3>
          <p className="text-sm text-gray-600 mb-4">
            Understanding your avatar's beliefs is critical for messaging that resonates.
          </p>

          <div className="space-y-4">
            {[
              { key: 'outcome', label: 'Outcome Belief', icon: '🎯', description: 'Can they achieve the desired outcome?' },
              { key: 'identity', label: 'Identity Belief', icon: '👤', description: 'Can someone like them achieve it?' },
              { key: 'problem', label: 'Problem Belief', icon: '⚠️', description: 'Do they understand the real problem?' },
              { key: 'solution', label: 'Solution Belief', icon: '💡', description: 'Do they believe in the solution approach?' },
              { key: 'product', label: 'Product Belief', icon: '📦', description: 'Do they believe in your specific product?' },
              { key: 'credibility', label: 'Credibility Belief', icon: '⭐', description: 'Do they trust you and your brand?' },
            ].map(({ key, label, icon, description }) => {
              const belief = currentProject?.avatar?.beliefs?.[key as keyof typeof currentProject.avatar.beliefs];
              if (!belief) return null;

              const statusColor =
                belief.transitionState === 'transformed' || belief.status === 'transformed' ? 'green' :
                belief.transitionState === 'receptive' || belief.status === 'receptive' ? 'yellow' :
                'red';

              const statusBg =
                statusColor === 'green' ? 'bg-green-100 text-green-800' :
                statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800';

              return (
                <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-900">{label}</h5>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                      {belief.transitionState || belief.status || 'closed'}
                    </span>
                  </div>

                  {belief.currentState !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Current Belief Strength</span>
                        <span className="font-medium">{belief.currentState}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            belief.currentState >= 7 ? 'bg-green-500' :
                            belief.currentState >= 4 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${belief.currentState * 10}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    {belief.currentBelief && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Current Belief</p>
                        <p className="text-gray-700">{belief.currentBelief}</p>
                      </div>
                    )}
                    {(belief.targetBelief || belief.requiredBelief) && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Required Belief</p>
                        <p className="text-gray-700">{belief.targetBelief || belief.requiredBelief}</p>
                      </div>
                    )}
                  </div>

                  {belief.beliefGap && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs font-medium text-yellow-800 mb-1">Belief Gap</p>
                      <p className="text-xs text-yellow-700">{belief.beliefGap}</p>
                    </div>
                  )}

                  {belief.bridgeStrategy && (
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-medium text-blue-800 mb-1">Bridge Strategy</p>
                      <p className="text-xs text-blue-700">{belief.bridgeStrategy}</p>
                    </div>
                  )}

                  {belief.commonObjections && belief.commonObjections.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Common Objections</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {belief.commonObjections.map((objection, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-red-500 mr-1">•</span>
                            <span>{objection}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(belief.copyRecommendations || belief.messagingHooks) && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Messaging Hooks</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(belief.copyRecommendations || belief.messagingHooks)?.map((hook, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>{hook}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary Currency & Million Dollar Message */}
      <div className="space-y-6">
        <div className="card">
          <label className="label">Primary Currency</label>
          <input
            type="text"
            value={primaryCurrency}
            onChange={(e) => setPrimaryCurrency(e.target.value)}
            placeholder="e.g., Time, Money, Status, Health"
            className="input"
          />
          <p className="text-sm text-gray-500 mt-2">What does your avatar value most?</p>
        </div>

        <div className="card">
          <label className="label">Million Dollar Message</label>
          <textarea
            value={millionDollarMessage}
            onChange={(e) => setMillionDollarMessage(e.target.value)}
            placeholder="I help [AVATAR] achieve [GOAL], so they can [DREAM] without [PAIN]"
            className="textarea"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Analyze Avatar</span>
              </>
            )}
          </button>
          <button
            onClick={handleContinue}
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

