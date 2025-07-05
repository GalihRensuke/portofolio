import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
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

// Optimized particle effect with reduced count and better cleanup
const TransitionParticles: React.FC<{ isTransitioning: boolean }> = ({ isTransitioning }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isTransitioning) {
      // Reduced particle count from 50 to 20
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
      setParticles(newParticles);

      // Cleanup particles after animation
      const cleanup = setTimeout(() => {
        setParticles([]);
      }, 800);

      return () => clearTimeout(cleanup);
    }
  }, [isTransitioning]);

  if (!isTransitioning || particles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 pointer-events-none"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-indigo-400 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: particle.id * 0.01,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

function AppContent() {
  const location = useLocation();
  const { setCurrentPage, setTimeOnPage } = useUserBehaviorStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);

  // Initialize theme on app load
  const { applyTheme } = useThemeStore();
  
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Track page changes with cleanup
  useEffect(() => {
    if (location.pathname !== previousPath) {
      setIsTransitioning(true);
      const transitionTimer = setTimeout(() => setIsTransitioning(false), 500); // Reduced from 800
      setPreviousPath(location.pathname);
      
      return () => clearTimeout(transitionTimer);
    }
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage, previousPath]);

  // Optimized time tracking with proper cleanup
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeOnPage = Date.now() - startTime;
      setTimeOnPage(timeOnPage);
    }, 5000); // Reduced frequency from 1000ms to 5000ms

    return () => clearInterval(interval);
  }, [location.pathname, setTimeOnPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Navigation only shown on non-home pages */}
      {location.pathname !== '/' && <Navigation />}
      
      <TransitionParticles isTransitioning={isTransitioning} />
      
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
  );
}

function App() {
  const [showBootSequence, setShowBootSequence] = useState(false);
  const [isBootComplete, setIsBootComplete] = useState(true); // Set to true by default

  const handleBootComplete = useCallback(() => {
    setShowBootSequence(false);
    setIsBootComplete(true);
  }, []);

  useEffect(() => {
    // Boot sequence is now optional - only show if explicitly triggered
    // setShowBootSequence(true);
  }, []);

  return (
    <>
      {showBootSequence && !isBootComplete && (
        <SystemBootSequence onBootComplete={handleBootComplete} />
      )}
      
      {(isBootComplete || !showBootSequence) && (
        <Router>
          <AppContent />
        </Router>
      )}
    </>
  );
}

export default App;