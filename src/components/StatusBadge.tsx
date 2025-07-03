import React from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

const StatusBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Circle className="h-2 w-2 fill-current" />
      </motion.div>
      <span>Available for collaboration</span>
    </motion.div>
  );
};

export default StatusBadge;