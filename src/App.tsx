import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import StackPage from './pages/StackPage';
import ContactPage from './pages/ContactPage';
import BlueprintPage from './pages/BlueprintPage';
import SandboxPage from './pages/SandboxPage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeArsenalPage from './pages/KnowledgeArsenalPage';
import { useUserBehaviorStore } from './store/userBehaviorStore';

function AppContent() {
  const location = useLocation();
  const { setCurrentPage, setTimeOnPage } = useUserBehaviorStore();

  // Track page changes
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeOnPage = Date.now() - startTime;
      setTimeOnPage(timeOnPage);
    }, 1000);

    return () => clearInterval(interval);
  }, [location.pathname, setTimeOnPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blueprint" element={<BlueprintPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/knowledge-arsenal" element={<KnowledgeArsenalPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;