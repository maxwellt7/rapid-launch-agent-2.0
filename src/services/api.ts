import axios from 'axios';
import type { OfferData, OfferAnalysis, AvatarData, CompetitorData, ManifoldData, LaunchDocData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  env: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE,
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes - Claude responses can take 20-60 seconds
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Offer Analysis
export async function analyzeOffer(offerData: OfferData): Promise<OfferAnalysis> {
  const response = await api.post('/analyze/offer', offerData, {
    timeout: 120000, // 2 minutes for Claude analysis
  });
  return response.data.data;
}

// Avatar Analysis
export async function analyzeAvatar(avatarData: AvatarData): Promise<Partial<AvatarData>> {
  const response = await api.post('/analyze/avatar', avatarData, {
    timeout: 120000, // 2 minutes for Claude analysis
  });
  return response.data.data;
}

// Competitor Analysis
export async function analyzeCompetitors(data: { industry: string; competitorUrls: string[] }): Promise<CompetitorData> {
  const response = await api.post('/analyze/competitors', data, {
    timeout: 180000, // 3 minutes for competitor analysis
  });
  return response.data.data;
}

// Manifold Workflow
export async function runManifoldWorkflow(data: {
  offer: OfferData;
  avatar: AvatarData;
  competitors: CompetitorData | null;
}): Promise<ManifoldData> {
  // Manifold takes 5-10 minutes for 14 nodes - need long timeout
  const response = await api.post('/analyze/manifold', data, {
    timeout: 600000, // 10 minutes
  });
  return response.data.data;
}

// Launch Document Generation
export async function generateLaunchDocument(data: {
  offer: OfferData;
  avatar: AvatarData;
  competitors: CompetitorData | null;
  manifold: ManifoldData;
  projectId: string;
  resume?: boolean;
}): Promise<LaunchDocData> {
  // Launch doc takes 20-30 minutes for 38 sections - need long timeout
  const response = await api.post('/generate/launch-document', data, {
    timeout: 2400000, // 40 minutes to handle API rate limits and delays
  });
  return response.data.data;
}

// Get generation progress
export async function getGenerationProgress(generationId: string): Promise<{
  generationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  totalSections: number;
  completedSections: number;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  sections: Array<{
    id: number;
    title: string;
    content: string;
    generatedAt: string;
  }>;
}> {
  const response = await api.get(`/generation/progress/${generationId}`);
  return response.data.data;
}

// Get latest generation for a project
export async function getLatestGeneration(projectId: string): Promise<{
  generationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  totalSections: number;
  completedSections: number;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  sections: Array<{
    id: number;
    title: string;
    content: string;
    generatedAt: string;
  }>;
} | null> {
  const response = await api.get(`/generation/latest/${projectId}`);
  return response.data.data;
}

// Export Document
export async function exportDocument(projectId: string, format: 'pdf' | 'docx' | 'md'): Promise<Blob> {
  const response = await api.post(`/export/${format}`, { projectId }, {
    responseType: 'blob',
  });
  return response.data;
}

// Query Interface
export async function queryLaunchDoc(projectId: string, question: string): Promise<string> {
  // Get project data from store
  const storedData = localStorage.getItem('rapid-launch-storage');
  let projectData = null;
  
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      const currentProject = parsed.state?.currentProject;
      if (currentProject) {
        projectData = {
          offer: currentProject.offer,
          avatar: currentProject.avatar,
          competitors: currentProject.competitors,
          manifold: currentProject.manifold,
          launchDoc: currentProject.launchDoc,
        };
      }
    } catch (error) {
      console.error('Error parsing project data:', error);
    }
  }
  
  const response = await api.post('/query', { 
    projectId, 
    question,
    projectData 
  }, {
    timeout: 60000, // 1 minute for query responses
  });
  return response.data.data.answer;
}

// Content Generation
export async function generateContent(data: {
  contentType: 'blur' | 'ad_script' | 'vsl' | 'landing_page' | 'email_sequence';
  projectId: string;
  avatar: any;
  offer: any;
  [key: string]: any;
}): Promise<any> {
  const response = await api.post('/generate/content', data, {
    timeout: 180000, // 3 minutes for content generation
  });
  return response.data;
}

export default api;

