import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { FileText, Download, Loader2, Search, RefreshCw, Package } from 'lucide-react';
import { generateLaunchDocument, getGenerationProgress, getLatestGeneration } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function LaunchDocument() {
  const navigate = useNavigate();
  const { currentProject, updateLaunchDoc } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 38 });
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'in_progress' | 'completed' | 'failed'>('idle');

  const launchDoc = currentProject?.launchDoc;
  const isGenerated = launchDoc && launchDoc.sections && launchDoc.sections.length > 0;

  // Check for existing in-progress generation on mount
  useEffect(() => {
    const checkExistingGeneration = async () => {
      if (!currentProject?.id) return;

      try {
        const latest = await getLatestGeneration(currentProject.id);
        if (latest && latest.status === 'in_progress') {
          setGenerationId(latest.generationId);
          setGenerationStatus('in_progress');
          setLoading(true);
          setProgress({ completed: latest.completedSections, total: latest.totalSections });

          // Update launch doc with existing sections
          if (latest.sections.length > 0) {
            updateLaunchDoc({
              sections: latest.sections,
              generatedAt: latest.startedAt,
            });
          }
        } else if (latest && latest.status === 'completed') {
          // Load completed generation
          updateLaunchDoc({
            sections: latest.sections,
            generatedAt: latest.completedAt || latest.startedAt,
          });
        }
      } catch (error) {
        console.error('Failed to check existing generation:', error);
      }
    };

    checkExistingGeneration();
  }, [currentProject?.id]);

  // Poll for progress updates
  useEffect(() => {
    if (!generationId || generationStatus !== 'in_progress') return;

    const interval = setInterval(async () => {
      try {
        const progressData = await getGenerationProgress(generationId);
        setProgress({ completed: progressData.completedSections, total: progressData.totalSections });

        // Update launch doc with new sections
        if (progressData.sections.length > 0) {
          updateLaunchDoc({
            sections: progressData.sections,
            generatedAt: progressData.startedAt,
          });
        }

        // Check if completed or failed
        if (progressData.status === 'completed') {
          setGenerationStatus('completed');
          setLoading(false);
          clearInterval(interval);
          alert('✅ Launch Document generated successfully! All 38 sections are complete.');
        } else if (progressData.status === 'failed') {
          setGenerationStatus('failed');
          setLoading(false);
          clearInterval(interval);
          alert(`❌ Generation failed: ${progressData.errorMessage || 'Unknown error'}. You can resume generation to pick up where it left off.`);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [generationId, generationStatus]);

  const handleGenerate = async (resume = false) => {
    if (!currentProject?.offer || !currentProject?.avatar || !currentProject?.manifold) {
      alert('Please complete all previous steps first');
      return;
    }

    if (!currentProject.id) {
      alert('Project ID is required');
      return;
    }

    const message = resume
      ? '🔄 Resume Generation\n\nThis will resume from where the previous generation left off.\n\nDo you want to continue?'
      : '⏰ Launch Document Generation\n\n' +
        'This will generate all 38 sections of your marketing brief.\n\n' +
        '⚠️ This takes 20-30 minutes to complete.\n' +
        '✅ Sections are saved as they\'re generated.\n' +
        '✅ You can safely close this tab and come back later.\n' +
        '✅ If generation fails, you can resume from where it left off.\n\n' +
        'Do you want to continue?';

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    setLoading(true);
    setGenerationStatus('in_progress');

    try {
      const response = await generateLaunchDocument({
        offer: currentProject.offer,
        avatar: currentProject.avatar,
        competitors: currentProject.competitors,
        manifold: currentProject.manifold,
        projectId: currentProject.id,
        resume,
      });

      // Backend now returns immediately with generation ID
      if (response.generationId) {
        setGenerationId(response.generationId);
        setProgress({ completed: 0, total: 38 });
        console.log('✅ Generation started:', response.generationId);
      } else {
        console.error('No generation ID returned');
        setLoading(false);
        setGenerationStatus('failed');
        alert('❌ Failed to start generation: No generation ID returned');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
      setGenerationStatus('failed');
      alert('❌ Failed to start generation. Please try again.');
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'md') => {
    // TODO: Implement export functionality
    alert(`Export as ${format.toUpperCase()} will be implemented`);
  };

  const filteredSections = launchDoc?.sections?.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Launch Document</h1>
            </div>
            <p className="text-gray-600">
              Comprehensive 38+ section with professional insights to deliver world class marketing in under 35 minutes.
            </p>
          </div>
          
          {isGenerated && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/project/summary')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>View Project Summary</span>
              </button>
              <button
                onClick={() => handleExport('md')}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>MD</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>DOCX</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!isGenerated ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generate Your Launch Document
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Combine all your insights from Offer Builder, Avatar Builder, Competitor Intelligence, and AI Manifold into one comprehensive marketing brief with 38+ strategic sections.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-3">Document will include:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Complete prospect analysis & psychology profile
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  10-point product analysis & benefit matrix
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Perfect offer engineering with pricing & terms
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Big idea, unique mechanism, & headlines
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  VSL structure, funnel architecture, & upsell sequence
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Complete sales page & marketing thesis
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => handleGenerate(false)}
            disabled={loading}
            className="btn btn-primary text-lg px-8 py-3 flex items-center space-x-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating Document...</span>
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                <span>Generate Launch Document</span>
              </>
            )}
          </button>

          {loading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg mx-auto">
              <p className="text-blue-900 font-medium mb-2">
                ⏰ Generating Launch Document...
              </p>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-blue-700 mb-1">
                  <span>Progress</span>
                  <span>{progress.completed} / {progress.total} sections</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-blue-700 text-sm">
                This takes 20-30 minutes. Sections are saved as they're generated.
                You can safely close this tab and come back - your progress is saved!
              </p>
            </div>
          )}

          {generationStatus === 'failed' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg mx-auto">
              <p className="text-yellow-900 font-medium mb-2">
                ⚠️ Generation Interrupted
              </p>
              <p className="text-yellow-700 text-sm mb-3">
                The generation was interrupted after completing {progress.completed} of {progress.total} sections.
                You can resume from where it left off.
              </p>
              <button
                onClick={() => handleGenerate(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resume Generation</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sections..."
                    className="input pl-10 text-sm"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-3 text-gray-700">
                Table of Contents ({launchDoc.sections.length} sections)
              </h3>
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {(searchTerm ? filteredSections : launchDoc.sections).map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(index);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSection === index
                        ? 'bg-primary-100 text-primary-900 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {section.id}. {section.title}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleGenerate(false)}
                  disabled={loading}
                  className="btn btn-outline w-full text-sm"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-3">
            <div className="card">
              {launchDoc.sections[selectedSection] && (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {launchDoc.sections[selectedSection].title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Section {launchDoc.sections[selectedSection].id} of {launchDoc.sections.length}
                    </p>
                  </div>
                  
                  <div className="prose max-w-none">
                    <ReactMarkdown>
                      {launchDoc.sections[selectedSection].content}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => setSelectedSection(Math.max(0, selectedSection - 1))}
                      disabled={selectedSection === 0}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setSelectedSection(Math.min(launchDoc.sections.length - 1, selectedSection + 1))}
                      disabled={selectedSection === launchDoc.sections.length - 1}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

