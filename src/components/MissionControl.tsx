import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity } from 'lucide-react';
import { useMissionLog } from '../hooks/useMissionLog';
import { formatDistanceToNow } from 'date-fns';

interface MissionControlProps {
  additionalText?: string;
}

const MissionControl: React.FC<MissionControlProps> = ({ additionalText }) => {
  const { currentMission, loading } = useMissionLog();

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
          <div className="text-gray-300">{currentMission?.log_entry}</div>
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