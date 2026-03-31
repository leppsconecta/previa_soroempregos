import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Static Imports for Performance and Stability (Fixing Blank Screen)
import { LandingPage } from './pages/public/LandingPage';
import { PublicJobs } from './pages/public/PublicJobs';
import { PublicGroups } from './pages/public/PublicGroups';
import { PublicPage } from './pages/public/PublicPage';
import { MarketingCourse } from './pages/public/MarketingCourse';

const AppContent: React.FC = () => {
  const mainRef = React.useRef<HTMLElement>(null);
  const location = useLocation();

  // Scroll to top on pathname change
  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="w-full h-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/vagas" element={<PublicJobs />} />
              <Route path="/grupos" element={<PublicGroups />} />
              <Route path="/cursos/marketing" element={<MarketingCourse />} />
              <Route path="/p/:username" element={<PublicPage />} />
              
              {/* Public Profile Route (Root Level) */}
              <Route path="/:username" element={<PublicPage />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
