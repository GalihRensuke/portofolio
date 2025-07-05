import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

interface MemoryStats {
  usedMB: number;
  totalMB: number;
  limitMB: number;
}

interface MemoryMonitorProps {
  isDarkMode: boolean;
  isMobile: boolean;
}

const MemoryMonitor: React.FC<MemoryMonitorProps> = ({ isDarkMode, isMobile }) => {
  // Using isDarkMode from props instead of theme store
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Check if performance monitoring is supported
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const stats: MemoryStats = {
          usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limitMB: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        };
        setMemoryStats(stats);

        // Alert if memory usage is high
        if (stats.usedMB > 500) {
          console.warn(`⚠️  High memory usage: ${stats.usedMB}MB`);
          // Log memory stats for debugging
          console.log('Memory Stats:', stats);
          // Consider triggering cleanup if memory usage is critical
          if (stats.usedMB > 700) {
            // Trigger garbage collection if available
            if (typeof window !== 'undefined' && window.gc) {
              window.gc();
            }
          }
        }
      };

      // Initial check
      checkMemory();

      // Check every 10 seconds
      const interval = setInterval(checkMemory, 10000);

      // Cleanup
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showMonitor ? 1 : 0, y: showMonitor ? 0 : 20 }}
      style={{
        display: showMonitor ? 'block' : 'none'
      }}
      className={`fixed bottom-4 ${isMobile ? 'left-4' : 'right-4'} p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Memory Usage</h3>
          {memoryStats && (
            <div className="text-xs">
              <p>Used: {memoryStats.usedMB}MB</p>
              <p>Total: {memoryStats.totalMB}MB</p>
              <p>Limit: {memoryStats.limitMB}MB</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowMonitor(!showMonitor)}
          className={`ml-2 p-1 rounded ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {showMonitor ? 'Hide' : 'Show'}
        </button>
      </div>
    </motion.div>
  );
};

export default MemoryMonitor;
