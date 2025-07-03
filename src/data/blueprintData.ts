import React from 'react';
import { GitBranch, Layers, Zap, Brain, Code, Database, Shield, Workflow } from 'lucide-react';

export interface BlueprintNode {
  id: string;
  label: string;
  parentNode?: string;
  category: 'core' | 'architecture' | 'mental' | 'implementation' | 'security';
  description: string;
  icon: string;
  position?: { x: number, y: number };
  isSectionHeader?: boolean;
  implementation?: string;
  examples?: string[];
  principles?: BlueprintNode[];
}

// Unified blueprint data structure
export const blueprintData: BlueprintNode[] = [
  // Core Design Principles (Section Header)
  {
    id: 'core-design-principles',
    label: 'Core Design Principles',
    category: 'core',
    description: 'Foundational architectural guidelines that inform all system design decisions. These principles establish the baseline for how systems are conceptualized, designed, and implemented.',
    icon: 'Brain',
    position: { x: 400, y: 80 },
    isSectionHeader: true
  },
  
  // Mental Operating Systems (Section Header)
  {
    id: 'mental-operating-systems',
    label: 'Mental Operating Systems',
    category: 'mental',
    description: 'Cognitive frameworks and decision models that guide architectural thinking and problem-solving approaches. These mental models provide structured ways to analyze complex problems and design effective solutions.',
    icon: 'Brain',
    position: { x: 700, y: 80 },
    isSectionHeader: true
  },
  
  // Implementation Patterns (Section Header)
  {
    id: 'implementation-patterns',
    label: 'Implementation Patterns',
    category: 'implementation',
    description: 'Practical patterns and approaches for turning architectural principles into working systems. These patterns provide concrete guidelines for implementing abstract principles in real-world scenarios.',
    icon: 'Code',
    position: { x: 350, y: 280 },
    isSectionHeader: true
  },
  
  // Security Principles (Section Header)
  {
    id: 'security-principles',
    label: 'Security Principles',
    category: 'security',
    description: 'Core security concepts that are integrated into every aspect of system design. Security is treated as a fundamental architectural concern rather than an afterthought or add-on.',
    icon: 'Shield',
    position: { x: 700, y: 380 },
    isSectionHeader: true
  },

  // Core Design Principles - Sub-principles
  {
    id: 'async-architecture',
    label: 'Async Architecture',
    parentNode: 'core-design-principles',
    category: 'architecture',
    description: 'Event-driven systems with non-blocking operations',
    implementation: 'Message queues, event sourcing, circuit breakers',
    examples: ['AirdropOps workflow orchestration', 'GalyarderOS routine automation'],
    icon: 'Zap',
    position: { x: 300, y: 160 }
  },
  {
    id: 'modularity-over-monolith',
    label: 'Modularity Over Monolith',
    parentNode: 'core-design-principles',
    category: 'architecture',
    description: 'Composable components with single responsibilities',
    implementation: 'Microservices, plugin architectures, dependency injection',
    examples: ['Prompt Codex DSL components', 'GalyarderOS module system'],
    icon: 'Layers',
    position: { x: 450, y: 160 }
  },
  {
    id: 'build-to-scale',
    label: 'Build-to-Scale Principles',
    parentNode: 'core-design-principles',
    category: 'architecture',
    description: 'Horizontal scaling patterns from day one',
    implementation: 'Load balancing, database sharding, CDN optimization',
    examples: ['AirdropOps multi-chain processing', 'Real-time analytics pipelines'],
    icon: 'GitBranch',
    position: { x: 500, y: 300 }
  },

  // Mental Operating Systems - Sub-principles
  {
    id: 'first-principles-thinking',
    label: 'First Principles Thinking',
    parentNode: 'mental-operating-systems',
    category: 'mental',
    description: 'Breaking down complex problems to fundamentals',
    implementation: 'Identifying core truths, questioning assumptions, reasoning from the ground up',
    examples: ['Technical debt evaluation matrices', 'Risk assessment frameworks'],
    icon: 'Brain',
    position: { x: 650, y: 260 }
  },
  {
    id: 'systems-thinking',
    label: 'Systems Thinking',
    parentNode: 'mental-operating-systems',
    category: 'mental',
    description: 'Understanding interconnections and feedback loops in complex systems',
    implementation: 'Causal loop diagrams, stock and flow models, emergence analysis',
    examples: ['Workflow optimization models', 'Ecosystem impact assessments'],
    icon: 'Workflow',
    position: { x: 750, y: 160 }
  },

  // Implementation Patterns - Sub-principles
  {
    id: 'data-driven-design',
    label: 'Data-Driven Design',
    parentNode: 'implementation-patterns',
    category: 'implementation',
    description: 'Designing systems around data flows rather than functions',
    implementation: 'Data modeling first, schema-driven development, event sourcing',
    examples: ['Vector knowledge base architecture', 'Prompt Codex template system'],
    icon: 'Database',
    position: { x: 250, y: 340 }
  },
  {
    id: 'continuous-evolution',
    label: 'Continuous Evolution',
    parentNode: 'implementation-patterns',
    category: 'implementation',
    description: 'Systems designed for constant improvement rather than big-bang releases',
    implementation: 'Feature flags, canary deployments, A/B testing frameworks',
    examples: ['GalyarderOS incremental module deployment', 'Prompt Codex versioning system'],
    icon: 'GitBranch',
    position: { x: 350, y: 460 }
  },

  // Security Principles - Sub-principles
  {
    id: 'defense-in-depth',
    label: 'Defense in Depth',
    parentNode: 'security-principles',
    category: 'security',
    description: 'Multiple layers of security controls throughout the system',
    implementation: 'Layered access controls, encryption at rest and in transit, security monitoring',
    examples: ['AirdropOps multi-stage validation', 'Knowledge pipeline access controls'],
    icon: 'Shield',
    position: { x: 550, y: 450 }
  },
  {
    id: 'principle-of-least-privilege',
    label: 'Principle of Least Privilege',
    parentNode: 'security-principles',
    category: 'security',
    description: 'Entities have only the minimum privileges necessary to perform their functions',
    implementation: 'Role-based access control, just-in-time access, permission boundaries',
    examples: ['Workflow execution permissions', 'API access token scoping'],
    icon: 'Shield',
    position: { x: 850, y: 380 }
  }
];

// Helper functions
export const getSectionHeaders = (): BlueprintNode[] => {
  return blueprintData.filter(node => node.isSectionHeader);
};

export const getSubPrinciples = (parentId: string): BlueprintNode[] => {
  return blueprintData.filter(node => node.parentNode === parentId);
};

export const getAllSubPrinciples = (): BlueprintNode[] => {
  return blueprintData.filter(node => !node.isSectionHeader);
};

export const getNodeById = (id: string): BlueprintNode | undefined => {
  return blueprintData.find(node => node.id === id);
};

// Icon mapping for components
export const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    GitBranch,
    Layers,
    Zap,
    Brain,
    Code,
    Database,
    Shield,
    Workflow
  };
  
  return iconMap[iconName] || Zap;
};

// Color mapping for categories
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'core':
      return 'bg-indigo-500';
    case 'architecture':
      return 'bg-blue-500';
    case 'mental':
      return 'bg-purple-500';
    case 'implementation':
      return 'bg-green-500';
    case 'security':
      return 'bg-red-500';
    default:
      return 'bg-gray-700';
  }
};

export const getCategoryTextColor = (category: string) => {
  switch (category) {
    case 'core':
      return 'text-indigo-400';
    case 'architecture':
      return 'text-blue-400';
    case 'mental':
      return 'text-purple-400';
    case 'implementation':
      return 'text-emerald-400';
    case 'security':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Edge color mapping
export const getEdgeColor = (category: string): string => {
  switch (category) {
    case 'architecture':
      return '#3b82f6';
    case 'mental':
      return '#8b5cf6';
    case 'implementation':
      return '#10b981';
    case 'security':
      return '#ef4444';
    default:
      return '#6366f1';
  }
};