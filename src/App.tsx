import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Lazy Load Pages for Performance
const LandingPage = React.lazy(() => import('./pages/public/LandingPage').then(module => ({ default: module.LandingPage })));
const PublicJobs = React.lazy(() => import('./pages/public/PublicJobs').then(module => ({ default: module.PublicJobs })));
const PublicGroups = React.lazy(() => import('./pages/public/PublicGroups').then(module => ({ default: module.PublicGroups })));
const PublicPage = React.lazy(() => import('./pages/public/PublicPage').then(module => ({ default: module.PublicPage })));



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
            <React.Suspense fallback={
              <div className="flex h-full w-full items-center justify-center min-h-[50vh] text-slate-400 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-sm font-medium animate-pulse">Carregando...</span>
              </div>
            }>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/vagas" element={<PublicJobs />} />
                <Route path="/grupos" element={<PublicGroups />} />
                <Route path="/p/:username" element={<PublicPage />} />
                
                {/* Public Profile Route (Root Level) */}
                <Route path="/:username" element={<PublicPage />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
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
