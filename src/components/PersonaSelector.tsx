import React from 'react';
import { motion } from 'framer-motion';
import { User, Code, TrendingUp, Eye } from 'lucide-react';
import { Persona } from '../hooks/usePersonalization';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ currentPersona, onPersonaChange }) => {
  const personas = [
    { id: 'founder' as Persona, label: 'Founder', icon: User, color: 'text-purple-400' },
    { id: 'developer' as Persona, label: 'Developer', icon: Code, color: 'text-blue-400' },
    { id: 'investor' as Persona, label: 'Investor', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center space-x-1 text-sm"
    >
      <Eye className="h-4 w-4 text-gray-400 mr-2" />
      <span className="text-gray-400 mr-2">Viewing as:</span>
      <div className="flex space-x-1">
        {personas.map((persona) => {
          const IconComponent = persona.icon;
          const isActive = currentPersona === persona.id;
          
          return (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <IconComponent className={`h-3 w-3 ${isActive ? persona.color : ''}`} />
              <span className="text-xs">{persona.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PersonaSelector;