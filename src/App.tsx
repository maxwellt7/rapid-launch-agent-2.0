import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Projects from './pages/Projects';
import OfferBuilder from './pages/OfferBuilder';
import AvatarBuilder from './pages/AvatarBuilder';
import CompetitorIntelligence from './pages/CompetitorIntelligence';
import Manifold from './pages/Manifold';
import LaunchDocument from './pages/LaunchDocument';
import ProjectSummary from './pages/ProjectSummary';
import Dashboard from './pages/Dashboard';
import ContentGeneration from './pages/ContentGeneration';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Pricing from './pages/Pricing';
import Layout from './components/Layout';
import { useProjectStore } from './store/useProjectStore';

function ProtectedRouteWithoutProject({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

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

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ProtectedRouteWithProject({ children }: { children: React.ReactNode }) {
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

  // Redirect to home if no project selected
  if (!currentProject) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/pricing" element={
            <ProtectedRouteWithoutProject>
              <Pricing />
            </ProtectedRouteWithoutProject>
          } />
          {/*These routes for if user is sign in but project not selected*/}
          <Route path="/home" element={
            <ProtectedRouteWithoutProject>
              <Home />
            </ProtectedRouteWithoutProject>
          } />
          <Route path="/projectList" element={
            <ProtectedRouteWithoutProject>
              <Projects />
            </ProtectedRouteWithoutProject>
          } />
        </Route>
        {/*These routes for if projected is selected and user is sign in*/}
        <Route
          path="/project"
          element={
            <ProtectedRouteWithProject>
              <Layout />
            </ProtectedRouteWithProject>
          }
        >
          <Route path="offer" element={<OfferBuilder />} />
          <Route path="avatar" element={<AvatarBuilder />} />
          <Route path="competitors" element={<CompetitorIntelligence />} />
          <Route path="manifold" element={<Manifold />} />
          <Route path="launch-doc" element={<LaunchDocument />} />
          <Route path="summary" element={<ProjectSummary />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content/:contentType" element={<ContentGeneration />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

