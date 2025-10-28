import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import OfferBuilder from './pages/OfferBuilder';
import AvatarBuilder from './pages/AvatarBuilder';
import CompetitorIntelligence from './pages/CompetitorIntelligence';
import Manifold from './pages/Manifold';
import LaunchDocument from './pages/LaunchDocument';
import ProjectSummary from './pages/ProjectSummary';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { useProjectStore } from './store/useProjectStore';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const currentProject = useProjectStore((state) => state.currentProject);

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Redirect to landing if no project selected
  if (!currentProject) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* Project pages with Layout - require authentication and project */}
        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="offer" element={<OfferBuilder />} />
          <Route path="avatar" element={<AvatarBuilder />} />
          <Route path="competitors" element={<CompetitorIntelligence />} />
          <Route path="manifold" element={<Manifold />} />
          <Route path="launch-doc" element={<LaunchDocument />} />
          <Route path="summary" element={<ProjectSummary />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

