import React from 'react';
import { motion } from 'framer-motion';

interface RotatingYinYangProps {
  imageSrc: string;
}

const RotatingYinYang: React.FC<RotatingYinYangProps> = ({ imageSrc }) => {
  return (
    <div className="flex items-center justify-center w-48 h-48 md:w-64 md:h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 10,
        }}
        className="w-full h-full"
      >
        <img 
          src={imageSrc} 
          alt="Yin-Yang Symbol" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
};

export default RotatingYinYang;