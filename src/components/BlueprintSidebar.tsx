import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getSectionHeaders, getSubPrinciples, getIconComponent, getCategoryTextColor } from '../data/blueprintData';

interface BlueprintSidebarProps {
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  expandedSections: string[];
  onToggleSection: (id: string) => void;
}

const BlueprintSidebar: React.FC<BlueprintSidebarProps> = ({
  activeSectionId,
  onSelectSection,
  expandedSections,
  onToggleSection
}) => {
  const sectionHeaders = getSectionHeaders();

  return (
    <div className="sticky top-24 h-fit">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Blueprint Navigation</h3>
        
        <nav className="space-y-2">
          {sectionHeaders.map((section) => {
            const subPrinciples = getSubPrinciples(section.id);
            const isExpanded = expandedSections.includes(section.id);
            const isActive = activeSectionId === section.id;
            const IconComponent = getIconComponent(section.icon);
            const textColor = getCategoryTextColor(section.category);

            return (
              <div key={section.id}>
                {/* Section Header */}
                <button
                  onClick={() => {
                    onSelectSection(section.id);
                    if (subPrinciples.length > 0) {
                      onToggleSection(section.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-indigo-400' : textColor}`} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>
                  {subPrinciples.length > 0 && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </button>

                {/* Sub-principles */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-2 space-y-1">
                    {subPrinciples.map((principle) => {
                      const isSubActive = activeSectionId === principle.id;
                      const SubIconComponent = getIconComponent(principle.icon);
                      const subTextColor = getCategoryTextColor(principle.category);

                      return (
                        <button
                          key={principle.id}
                          onClick={() => onSelectSection(principle.id)}
                          className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-all ${
                            isSubActive
                              ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                              : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          <SubIconComponent className={`h-3 w-3 ${isSubActive ? 'text-indigo-400' : subTextColor}`} />
                          <span className="text-xs">{principle.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => onSelectSection('interactive-system-map')}
              className="w-full text-left p-2 text-xs text-gray-400 hover:text-indigo-400 hover:bg-gray-800/50 rounded transition-colors"
            >
              View Interactive Map
            </button>
            <button
              onClick={() => onSelectSection('decision-framework')}
              className="w-full text-left p-2 text-xs text-gray-400 hover:text-indigo-400 hover:bg-gray-800/50 rounded transition-colors"
            >
              Decision Framework
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintSidebar;