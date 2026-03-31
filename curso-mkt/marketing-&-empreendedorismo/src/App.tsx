/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import MarketingCourse from "./pages/MarketingCourse";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-6xl font-black text-blue-600 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Ops! Essa página não foi encontrada.</p>
      <Link 
        to="/cursos/marketing" 
        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
      >
        Voltar para o curso
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cursos/marketing" element={<MarketingCourse />} />
        {/* Redirect root to the marketing course */}
        <Route path="/" element={<Navigate to="/cursos/marketing" replace />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
