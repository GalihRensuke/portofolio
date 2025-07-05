import React from 'react';
import { motion } from 'framer-motion';

const dotVariants = {
  start: {
    y: "0%",
  },
  end: {
    y: "100%",
  },
};

const dotTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut",
};

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <motion.span
        className="block w-1.5 h-1.5 rounded-full bg-indigo-400"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.span
        className="block w-1.5 h-1.5 rounded-full bg-indigo-400"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.1 }}
      />
      <motion.span
        className="block w-1.5 h-1.5 rounded-full bg-indigo-400"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
    </div>
  );
};

export default TypingIndicator;