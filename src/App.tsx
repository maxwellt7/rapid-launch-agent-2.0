import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
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

function App() {
  const currentProject = useProjectStore((state) => state.currentProject);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/project"
          element={
            <SignedIn>
              {currentProject ? (
                <Layout />
              ) : (
                <Navigate to="/" replace />
              )}
            </SignedIn>
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

