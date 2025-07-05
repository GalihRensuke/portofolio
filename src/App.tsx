import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import MemoryMonitor from './components/MemoryMonitor';
import SystemBootSequence from './components/SystemBootSequence';
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
import { useThemeStore } from './store/themeStore';
import { usePerformanceOptimizations } from './utils/performanceOptimizer';

interface AppProps {
  location: ReturnType<typeof useLocation>;
  isMobile: boolean;
}

// Optimized page variants - reduced blur to improve performance
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(5px)", // Reduced from 10px
  },
  in: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    scale: 1.05, // Reduced from 1.2
    filter: "blur(5px)", // Reduced from 10px
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5 // Reduced from 0.8
};



const AppContent: React.FC<AppProps> = ({ location, isMobile }) => {
  const { isDarkMode } = useThemeStore();
  const { simplifyAnimations } = usePerformanceOptimizations();

  const { setCurrentPage } = useUserBehaviorStore();
  const [previousPath, setPreviousPath] = useState(location.pathname);

  // Mobile optimization
  useEffect(() => {
    // Simplify animations on mobile
    if (isMobile) {
      simplifyAnimations();
    }
  }, [isMobile, simplifyAnimations]);

  // Track page changes
  useEffect(() => {
    if (location.pathname !== previousPath) {
      setPreviousPath(location.pathname);
    }
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage, previousPath]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-white'} transition-colors duration-300`}>
      <div className="relative overflow-hidden">
        <div className={`container mx-auto px-4 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
          <MemoryMonitor isDarkMode={isDarkMode} isMobile={isMobile} />
          <SystemBootSequence onBootComplete={() => {}} />
          <Navigation isDarkMode={isDarkMode} isMobile={isMobile} />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HomePage />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AboutPage />
                </motion.div>
              } />
              <Route path="/projects" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ProjectsPage />
                </motion.div>
              } />
              <Route path="/stack" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StackPage />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ContactPage />
                </motion.div>
              } />
              <Route path="/blueprint" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BlueprintPage />
                </motion.div>
              } />
              <Route path="/sandbox" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SandboxPage />
                </motion.div>
              } />
              <Route path="/dashboard" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DashboardPage />
                </motion.div>
              } />
              <Route path="/knowledge-arsenal" element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <KnowledgeArsenalPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  return (
    <AppContent location={location} isMobile={isMobile} />
  );
}

export default App;