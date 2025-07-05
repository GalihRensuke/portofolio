import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MissionLog {
  id: string;
  timestamp: string;
  log_entry: string;
  status: 'active' | 'completed' | 'planning';
  project_tag?: string;
}

interface MissionControlProps {
  additionalText?: string;
}

const MissionControl: React.FC<MissionControlProps> = ({ additionalText }) => {
  const [currentMission, setCurrentMission] = useState<MissionLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestMission = async () => {
    setLoading(true);
    setError(null);
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.warn("VITE_N8N_WEBHOOK_URL is not set. Using mock data.");
      setCurrentMission({
        id: 'mock_1',
        timestamp: new Date().toISOString(),
        log_entry: 'System initialization complete - All modules operational',
        status: 'active',
        project_tag: 'core_systems'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${n8nWebhookUrl}/mission_logs/latest_active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MissionLog = await response.json();
      setCurrentMission(data);
    } catch (err) {
      console.error('Mission log fetch failed:', err);
      setError('Failed to fetch live mission log');
      // Fallback to mock data on error
      setCurrentMission({
        id: 'mock_2',
        timestamp: new Date().toISOString(),
        log_entry: 'Building Galyarder Ascendancy - Phase 1 Complete',
        status: 'active',
        project_tag: 'ascendancy'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMission();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLatestMission, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Terminal className="h-4 w-4 animate-pulse" />
        <span>Loading mission status...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-2"
    >
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="h-4 w-4 text-green-400" />
        </motion.div>
        <span className="text-green-400 font-medium">Mission Active</span>
      </div>
      
      <div className="flex items-start space-x-2">
        <Terminal className="h-4 w-4 text-indigo-400 mt-0.5" />
        <div>
          <AnimatePresence mode="wait">
            {currentMission && (
              <motion.div
                key={currentMission.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="text-gray-300"
              >
                {currentMission.log_entry}
              </motion.div>
            )}
          </AnimatePresence>
          {currentMission?.timestamp && (
            <div className="text-xs text-gray-500 mt-1">
              Updated {formatDistanceToNow(new Date(currentMission.timestamp))} ago
            </div>
          )}
        </div>
        {additionalText && (
          <span className="text-sm font-medium text-gray-400 tracking-wide whitespace-nowrap">
            {additionalText}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MissionControl;