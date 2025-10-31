import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { FolderOpen, Plus, Calendar, ArrowRight } from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, createProject, loadProject } = useProjectStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      createProject(projectName);
      setProjectName('');
      setShowNewProject(false);
      // Navigate to offer builder with the newly created project
      navigate('/project/offer');
    }
  };

  const handleOpenProject = (projectId: string) => {
    loadProject(projectId);
    navigate('/project/offer');
  };

  const getStatusBadge = (step: number) => {
    if (step >= 5) {
      return { 
        label: 'Completed', 
        color: 'bg-green-100 text-green-700',
        buttonStyle: 'bg-white hover:bg-blue-500 text-gray-700 hover:text-white border border-gray-300'
      };
    } else if (step >= 1) {
      return { 
        label: 'In Progress', 
        color: 'bg-blue-100 text-blue-700',
        buttonStyle: 'bg-white hover:bg-blue-500 text-gray-700 hover:text-white border border-gray-300'
      };
    } else {
      return { 
        label: 'Draft', 
        color: 'bg-gray-100 text-gray-700',
        buttonStyle: 'bg-white hover:bg-blue-500 text-gray-700 hover:text-white border border-gray-300'
      };
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h1>
            <p className="text-gray-600">Manage your launch projects and create new campaigns</p>
          </div>
          <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2"/>
            New Project
          </button>
        </div>

        {/* New Project Modal */}
        {showNewProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <form onSubmit={handleCreateProject}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g., Product Launch Campaign"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Create Project
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowNewProject(false);
                          setProjectName('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const status = getStatusBadge(project.currentStep);
            return (
                <div
                    key={project.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200"
                >
                  {/* Project Icon and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-blue-500"/>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {project.name}
                  </h3>

                  {/* Project Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2"/>
                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>

                  {/* Open Project Button */}
                  <button
                      onClick={() => handleOpenProject(project.id)}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${status.buttonStyle}`}
                  >
                    <span>Open Project</span>
                    <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
            );
          })}
        </div>
      </div>
  );
}

