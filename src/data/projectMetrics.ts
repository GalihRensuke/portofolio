import { ProjectMetrics } from '../lib/supabase';

export const projectMetrics: ProjectMetrics[] = [
  {
    id: 'galyarderos',
    project_name: 'GalyarderOS',
    objective: 'Eliminate cognitive overhead in personal productivity through unified system architecture.',
    system_architecture: 'Modular microservices architecture with React frontend, Supabase backend, and AI-powered automation layer. Event-driven communication between routine management, financial tracking, and workflow orchestration modules.',
    outcome: 'Achieved 85% reduction in daily decision fatigue and 3x improvement in task completion velocity.',
    metrics: {
      efficiency_gain: '85% reduction in decision fatigue',
      time_saved: '2.5 hours daily',
      transactions_processed: '10,000+ automated workflows'
    },
    tech_stack: ['Next.js', 'Zustand', 'Supabase', 'shadcn/ui', 'OpenAI API'],
    visual_flow: 'User Input → AI Processing → State Management → Database → Automated Actions',
    status: 'development'
  },
  {
    id: 'airdropops',
    project_name: 'AirdropOps',
    objective: 'Scale Web3 opportunity capture through intelligent automation and risk management.',
    system_architecture: 'Event-driven automation pipeline: Telegram monitoring → LLM analysis → n8n workflow execution → Multi-chain transaction processing. Implements circuit breaker patterns and automated risk assessment.',
    outcome: 'Processed 50,000+ opportunities with 92% accuracy and 200% ROI improvement.',
    metrics: {
      roi: '200% improvement',
      transactions_processed: '50,000+ opportunities analyzed',
      efficiency_gain: '90% reduction in manual operations'
    },
    tech_stack: ['OpenRouter', 'n8n', 'Telegram API', 'LangChain', 'Web3.js'],
    visual_flow: 'Telegram → LLM Filter → Risk Assessment → n8n Workflow → Blockchain Execution',
    status: 'production'
  },
  {
    id: 'prompt-codex',
    project_name: 'Prompt Codex',
    objective: 'Systematize AI workflow creation through composable prompt architecture.',
    system_architecture: 'DSL-based prompt composition system with version control, A/B testing framework, and performance analytics. Modular prompt components with dependency injection and template inheritance.',
    outcome: 'Reduced AI workflow development time by 70% and improved output consistency by 85%.',
    metrics: {
      efficiency_gain: '70% faster workflow development',
      time_saved: '15 hours weekly'
    },
    tech_stack: ['GPT-4', 'Next.js', 'Markdown', 'TypeScript', 'Vercel'],
    visual_flow: 'Prompt Templates → DSL Compiler → AI Model → Output Validation → Analytics',
    status: 'development'
  }
];