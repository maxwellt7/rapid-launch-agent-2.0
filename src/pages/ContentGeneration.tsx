import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { generateContent } from '../services/api';
import {
  ArrowLeft,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  Mail,
  Video,
  Target,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';

export default function ContentGeneration() {
  const { contentType } = useParams<{ contentType: string }>();
  const navigate = useNavigate();
  const currentProject = useProjectStore((state) => state.currentProject);

  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Content type configurations
  const contentConfigs = {
    blur: {
      name: 'BLUR Campaign',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Cold email lead generation campaign with ICP segmentation',
      fields: [
        { id: 'objective', label: 'Campaign Objective', type: 'text', placeholder: 'e.g., Book 20 qualified sales calls', required: true },
        { id: 'constraints', label: 'Constraints/Preferences', type: 'textarea', placeholder: 'Any specific requirements or constraints...', required: false },
      ],
    },
    ad_script: {
      name: 'Ad Scripts',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Platform-optimized video ad scripts for Facebook, YouTube, and TikTok',
      fields: [
        { id: 'objective', label: 'Ad Objective', type: 'text', placeholder: 'e.g., Drive clicks to landing page', required: true },
        { id: 'productionLevel', label: 'Production Style', type: 'select', options: ['UGC-style (user-generated)', 'Professional production', 'Hybrid'], required: true },
        { id: 'keyMessage', label: 'Key Message', type: 'text', placeholder: 'Main message to communicate', required: false },
      ],
    },
    vsl: {
      name: 'VSL Script',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Complete video sales letter script (20-30 minutes)',
      fields: [
        { id: 'length', label: 'Target Length', type: 'select', options: ['15-20 minutes', '20-30 minutes', '30-45 minutes'], required: true },
        { id: 'mechanism', label: 'Unique Mechanism', type: 'text', placeholder: 'Your proprietary method/framework', required: false },
        { id: 'yourStory', label: 'Your Origin Story', type: 'textarea', placeholder: 'Brief version of your story...', required: false },
      ],
    },
    landing_page: {
      name: 'Landing Page',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'High-converting sales page copy',
      fields: [
        { id: 'pageType', label: 'Page Type', type: 'select', options: ['Long-form (3,000-8,000 words)', 'Short-form (500-1,500 words)', 'Squeeze page (100-300 words)'], required: true },
        { id: 'trafficSource', label: 'Traffic Source', type: 'select', options: ['Cold paid traffic', 'Warm email list', 'Social media', 'Organic search'], required: true },
        { id: 'goal', label: 'Primary Goal', type: 'select', options: ['Direct sales', 'Lead generation', 'Webinar registration', 'Application/quiz'], required: true },
      ],
    },
    email_sequence: {
      name: 'Email Sequence',
      icon: Send,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Multi-email nurture or sales sequence',
      fields: [
        { id: 'sequenceType', label: 'Sequence Type', type: 'select', options: ['Welcome', 'Nurture', 'Sales', 'Launch', 'Re-engagement', 'Onboarding'], required: true },
        { id: 'emailCount', label: 'Number of Emails', type: 'number', placeholder: '5', required: true },
        { id: 'timeframe', label: 'Timeframe', type: 'text', placeholder: 'e.g., 7-10 days', required: true },
        { id: 'tone', label: 'Tone', type: 'select', options: ['Conversational and friendly', 'Professional and authoritative', 'Educational', 'Urgent and direct'], required: true },
      ],
    },
  };

  const config = contentType ? contentConfigs[contentType as keyof typeof contentConfigs] : null;
  const Icon = config?.icon || Sparkles;

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!currentProject?.id || !contentType) return;

    setGenerating(true);

    try {
      // Prepare request data
      const requestData = {
        contentType: contentType as 'blur' | 'ad_script' | 'vsl' | 'landing_page' | 'email_sequence',
        projectId: currentProject.id,
        avatar: currentProject.avatar?.analysisJson || currentProject.avatar,
        offer: currentProject.offer?.analysisJson || currentProject.offer,
        ...formData,
      };

      // Call API
      const result = await generateContent(requestData);
      setGeneratedContent(result.data);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;

    const contentText = JSON.stringify(generatedContent.content || generatedContent, null, 2);
    navigator.clipboard.writeText(contentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const contentText = JSON.stringify(generatedContent, null, 2);
    const blob = new Blob([contentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!config) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Invalid content type</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary mt-4"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-3 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>

          <div className="space-y-4">
            {/* Source Data Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">Using Your Analysis Data:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ EYO Offer Analysis (Score: {currentProject?.offer?.analysisJson?.eyoScores?.totalScore || 'N/A'}/50)</li>
                <li>✓ Avatar with 6 Beliefs Framework</li>
                <li>✓ Psychographic Profile</li>
              </ul>
            </div>

            {/* Dynamic Form Fields */}
            {config.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="input w-full"
                    required={field.required}
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="input w-full"
                    required={field.required}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="input w-full"
                    required={field.required}
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="input w-full"
                    required={field.required}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <button
              onClick={handleGenerate}
              disabled={generating || !currentProject?.offer || !currentProject?.avatar}
              className="btn btn-primary w-full flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate {config.name}</span>
                </>
              )}
            </button>

            {!currentProject?.offer || !currentProject?.avatar ? (
              <p className="text-sm text-red-600 text-center">
                Please complete Offer and Avatar analysis first
              </p>
            ) : null}
          </div>
        </div>

        {/* Generated Content Display */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Content</h2>
            {generatedContent && (
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {!generatedContent ? (
            <div className="text-center py-12 text-gray-500">
              <Icon className={`w-16 h-16 mx-auto mb-4 ${config.color} opacity-20`} />
              <p>Your generated content will appear here</p>
              <p className="text-sm mt-2">Configure settings and click Generate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display different formats based on content type */}
              {contentType === 'ad_script' && generatedContent.platforms && (
                <div className="space-y-6">
                  {Object.entries(generatedContent.platforms).map(([platform, content]: [string, any]) => (
                    <div key={platform} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg capitalize mb-2">{platform}</h3>
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {contentType !== 'ad_script' && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-[600px] whitespace-pre-wrap">
                    {typeof generatedContent.content === 'string'
                      ? generatedContent.content
                      : JSON.stringify(generatedContent.content || generatedContent, null, 2)}
                  </pre>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p>Generated in {generatedContent.meta?.generationTime ? `${(generatedContent.meta.generationTime / 1000).toFixed(1)}s` : 'N/A'}</p>
                <p className="text-xs mt-1">Content Type: {generatedContent.type || contentType}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
