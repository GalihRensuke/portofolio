import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import ClearanceLevelIndicator from './ClearanceLevelIndicator';
import MissionControl from './MissionControl';
import AchievementModal from './AchievementModal';
import { incrementEngagementScore } from '../utils/gamification';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Increment engagement score
    incrementEngagementScore(1);
    
    // Increment click count
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    // Check if easter egg threshold is reached
    if (newCount >= 10) {
      setShowAchievementModal(true);
      setLogoClickCount(0); // Reset counter
      // Bonus points for finding the easter egg
      incrementEngagementScore(10);
    }
    
    // Navigate to home after a short delay to allow the click to register
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
    { path: '/blueprint', label: 'Blueprint' },
    { path: '/projects', label: 'Projects' },
    { path: '/sandbox', label: 'Sandbox' },
    { path: '/stack', label: 'Stack' },
    { path: '/knowledge-arsenal', label: 'Knowledge Arsenal' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo Only */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={handleLogoClick}
            >
              <Terminal className="h-6 w-6 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
              <span className="font-semibold text-lg text-gray-900 dark:text-white">Galyarder</span>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                    location.pathname === item.path
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Clearance Level + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Clearance Level - Always visible, compact on mobile */}
            <div className="flex-shrink-0">
              <ClearanceLevelIndicator className="scale-90 sm:scale-100" />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm"
        >
          <div className="py-4 space-y-1 border-t border-gray-200 dark:border-gray-800">
            {/* Mission Control in Mobile Menu */}
            <div className="px-4 py-3 mx-2 border-b border-gray-200 dark:border-gray-800 mb-4">
              <MissionControl />
            </div>
            
            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-colors ${
                  location.pathname === item.path
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
      />
    </nav>
  );
};

export default Navigation;