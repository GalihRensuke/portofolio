import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
}

interface NavigationProps {
  isMobile: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const navItems: NavigationItem[] = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/stack', label: 'Stack' },
    { path: '/contact', label: 'Contact' },
    { path: '/blueprint', label: 'Blueprint' },
    { path: '/sandbox', label: 'Sandbox' },
    { path: '/knowledge-arsenal', label: 'Knowledge Arsenal' }
  ];

  return (
    <nav className={`fixed top-0 w-full ${isMobile ? 'bg-white/80 dark:bg-gray-950/80' : 'bg-white/90 dark:bg-gray-950/90'} backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={handleLogoClick} className="flex items-center">
            <Terminal className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Galyarder</span>
          </Link>

          {!isMobile && (
            <div className="hidden lg:flex lg:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;