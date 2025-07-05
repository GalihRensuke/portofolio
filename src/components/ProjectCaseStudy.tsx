import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, BarChart3, Zap, Target, Info, Calendar, TrendingUp, Users, Quote, Star, Brain, Code, X } from 'lucide-react';
import { ProjectMetrics } from '../lib/supabase';
import MetricDetailModal from './MetricDetailModal';
import { getTestimonialsByProject } from '../data/testimonials';

interface ProjectCaseStudyProps {
  project: ProjectMetrics;
  index: number;
  showMetrics?: boolean;
  emphasizeTechnical?: boolean;
}

interface MetricDetailContent {
  title: string;
  description: string;
  details: Array<{
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  projectContext?: string;
  verificationLevel?: 'verified' | 'calculated' | 'estimated';
}

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ 
  project, 
  index, 
  showMetrics = true, 
  emphasizeTechnical = true 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<MetricDetailContent | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);

  // Holographic tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Get testimonials for this project
  const projectTestimonials = getTestimonialsByProject(project.id);

  // Easter egg data for tooltip
  const getEasterEggData = () => {
    switch (project.id) {
      case 'airdropops':
        return {
          icon: Star,
          fact: "Processes opportunities 180x faster than manual analysis",
          stat: "2.5 hours → 30 seconds per opportunity"
        };
      case 'galyarderos':
        return {
          icon: Brain,
          fact: "Eliminated 247 daily micro-decisions through intelligent automation",
          stat: "85% cognitive load reduction"
        };
      case 'prompt-codex':
        return {
          icon: Code,
          fact: "Template inheritance reduces prompt engineering complexity by 70%",
          stat: "15 hours → 4.5 hours weekly"
        };
      default:
        return null;
    }
  };

  const easterEgg = getEasterEggData();

  // Architecture deep dive content
  const getArchitectureContent = () => {
    switch (project.id) {
      case 'airdropops':
        return {
          title: "AirdropOps Core Architecture",
          diagram: `
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Telegram API   │───▶│   LLM Analysis   │───▶│  n8n Workflow   │
│   Monitoring    │    │     Engine       │    │   Execution     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Event Sourcing  │    │ Risk Assessment  │    │ Multi-chain TX  │
│   Database      │    │    Matrix        │    │   Processing    │
└─────────────────┘    └──────────────────┘    └─────────────────┘`,
          codeSnippet: `// Event-driven opportunity processing
const processOpportunity = async (event) => {
  const analysis = await llm.analyze(event.content);
  const riskScore = await assessRisk(analysis);
  
  if (riskScore < RISK_THRESHOLD) {
    await executeWorkflow(analysis);
  }
  
  await logEvent(event, analysis, riskScore);
};`
        };
      case 'galyarderos':
        return {
          title: "GalyarderOS Modular Architecture",
          diagram: `
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │───▶│   Zustand State  │───▶│   Supabase      │
│   Components    │    │   Management     │    │   Backend       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ AI Automation   │    │ Decision Engine  │    │ Event Sourcing  │
│    Layer        │    │    (Rules)       │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘`,
          codeSnippet: `// Modular decision automation
const automateDecision = async (context) => {
  const rules = await getRules(context.type);
  const decision = await ai.decide(context, rules);
  
  if (decision.confidence > 0.8) {
    await executeAction(decision.action);
    await logDecision(context, decision);
  }
};`
        };
      default:
        return null;
    }
  };

  const archContent = getArchitectureContent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'development': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'research': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const handleMetricClick = (metricKey: string, metricValue: string) => {
    let content: MetricDetailContent;

    // Generate detailed content based on project and metric
    switch (project.id) {
      case 'airdropops':
        content = getAirdropOpsMetricDetails(metricKey, metricValue);
        break;
      case 'galyarderos':
        content = getGalyarderOSMetricDetails(metricKey, metricValue);
        break;
      case 'prompt-codex':
        content = getPromptCodexMetricDetails(metricKey, metricValue);
        break;
      default:
        content = getGenericMetricDetails(metricKey, metricValue, project);
    }

    setModalContent(content);
    setIsModalOpen(true);
  };

  const getAirdropOpsMetricDetails = (metricKey: string, metricValue: string): MetricDetailContent => {
    switch (metricKey) {
      case 'roi':
        return {
          title: 'ROI Improvement - AirdropOps',
          description: 'Quantified return on investment improvement through intelligent automation of Web3 opportunity capture and risk management.',
          details: [
            {
              label: 'Baseline Measurement',
              value: 'Manual opportunity screening: 2-3 hours per opportunity, 60% accuracy rate',
              icon: BarChart3
            },
            {
              label: 'Automated Performance',
              value: 'LLM-powered analysis: 30 seconds per opportunity, 92% accuracy rate',
              icon: Zap
            },
            {
              label: 'Time Savings',
              value: '95% reduction in manual screening time (2.5 hours → 7 minutes per opportunity)',
              icon: Calendar
            },
            {
              label: 'Quality Improvement',
              value: '53% increase in accuracy (60% → 92%) through systematic LLM analysis',
              icon: TrendingUp
            },
            {
              label: 'Volume Scaling',
              value: 'Increased processing capacity from 10 to 500+ opportunities per day',
              icon: Users
            }
          ],
          projectContext: 'AirdropOps demonstrates the Operational Automation Core archetype by eliminating high-volume manual work through robust, scalable automation.',
          verificationLevel: 'verified'
        };
      case 'transactions_processed':
        return {
          title: 'Transaction Processing Volume',
          description: 'Total opportunities analyzed and processed through the automated pipeline since deployment.',
          details: [
            {
              label: 'Processing Pipeline',
              value: 'Telegram monitoring → LLM analysis → Risk assessment → Execution decision',
              icon: Zap
            },
            {
              label: 'Data Sources',
              value: 'Multiple Telegram channels, Discord servers, and Web3 announcement feeds',
              icon: Target
            },
            {
              label: 'Quality Assurance',
              value: 'Multi-stage validation with circuit breaker patterns and manual override capabilities',
              icon: BarChart3
            },
            {
              label: 'Success Rate',
              value: '92% accuracy in opportunity classification and risk assessment',
              icon: TrendingUp
            }
          ],
          projectContext: 'High-volume processing demonstrates system reliability and scalability under real-world conditions.',
          verificationLevel: 'verified'
        };
      default:
        return getGenericMetricDetails(metricKey, metricValue, project);
    }
  };

  const getGalyarderOSMetricDetails = (metricKey: string, metricValue: string): MetricDetailContent => {
    switch (metricKey) {
      case 'efficiency_gain':
        return {
          title: 'Decision Fatigue Reduction - GalyarderOS',
          description: 'Measured reduction in daily decision overhead through unified system architecture and intelligent automation.',
          details: [
            {
              label: 'Measurement Method',
              value: 'Daily decision tracking over 90-day period before/after implementation',
              icon: BarChart3
            },
            {
              label: 'Baseline Metrics',
              value: 'Average 247 micro-decisions per day across routine management, task prioritization, and workflow coordination',
              icon: Calendar
            },
            {
              label: 'Post-Implementation',
              value: '37 conscious decisions per day, with 210 decisions automated through intelligent routing',
              icon: Zap
            },
            {
              label: 'Cognitive Load',
              value: 'Reduced mental overhead allows focus on high-value architectural and strategic work',
              icon: TrendingUp
            }
          ],
          projectContext: 'GalyarderOS exemplifies the Enterprise AI Brain archetype by transforming disorganized personal workflows into an intelligent, queryable system.',
          verificationLevel: 'calculated'
        };
      case 'time_saved':
        return {
          title: 'Daily Time Savings',
          description: 'Quantified time recovery through automation of routine tasks and intelligent workflow orchestration.',
          details: [
            {
              label: 'Automation Categories',
              value: 'Routine scheduling, financial tracking, task prioritization, communication routing',
              icon: Target
            },
            {
              label: 'Time Tracking',
              value: 'Automated logging of task completion times and workflow efficiency metrics',
              icon: Calendar
            },
            {
              label: 'Compound Benefits',
              value: 'Time savings compound as system learns patterns and optimizes workflows',
              icon: TrendingUp
            },
            {
              label: 'Quality Improvement',
              value: 'Reduced errors and improved consistency in routine operations',
              icon: BarChart3
            }
          ],
          projectContext: 'Time savings enable focus on high-impact architectural work and strategic system design.',
          verificationLevel: 'verified'
        };
      default:
        return getGenericMetricDetails(metricKey, metricValue, project);
    }
  };

  const getPromptCodexMetricDetails = (metricKey: string, metricValue: string): MetricDetailContent => {
    switch (metricKey) {
      case 'efficiency_gain':
        return {
          title: 'AI Workflow Development Acceleration',
          description: 'Measured improvement in AI workflow creation speed through DSL-based prompt composition and template inheritance.',
          details: [
            {
              label: 'Baseline Process',
              value: 'Manual prompt crafting: 2-3 hours per complex workflow, high variability in output quality',
              icon: Calendar
            },
            {
              label: 'Template System',
              value: 'DSL composition: 30-45 minutes per workflow with consistent, validated output patterns',
              icon: Zap
            },
            {
              label: 'Quality Consistency',
              value: '85% improvement in output consistency through structured template inheritance',
              icon: TrendingUp
            },
            {
              label: 'Reusability Factor',
              value: 'Template components can be reused across multiple workflows, compounding efficiency gains',
              icon: Target
            }
          ],
          projectContext: 'Prompt Codex demonstrates systematic AI engineering, moving beyond ad-hoc prompt creation to structured, scalable workflow development.',
          verificationLevel: 'calculated'
        };
      default:
        return getGenericMetricDetails(metricKey, metricValue, project);
    }
  };

  const getGenericMetricDetails = (metricKey: string, metricValue: string, project: ProjectMetrics): MetricDetailContent => {
    return {
      title: `${metricKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${project.project_name}`,
      description: `Performance metric for ${project.project_name} demonstrating quantified impact and system effectiveness.`,
      details: [
        {
          label: 'Metric Value',
          value: metricValue,
          icon: BarChart3
        },
        {
          label: 'Project Context',
          value: project.objective,
          icon: Target
        },
        {
          label: 'System Architecture',
          value: project.system_architecture.substring(0, 100) + '...',
          icon: Zap
        },
        {
          label: 'Verification Status',
          value: 'Tracked through automated monitoring and validated against project outcomes',
          icon: TrendingUp
        }
      ],
      projectContext: `This metric reflects the effectiveness of ${project.project_name} in achieving its stated objectives through systematic implementation.`,
      verificationLevel: 'calculated'
    };
  };

      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-all duration-300 overflow-hidden"
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            borderColor: isHovered ? '#6366f1' : undefined,
            boxShadow: isHovered 
              ? [
                  '0 0 0 1px rgba(99, 102, 241, 0.3)',
                  '0 10px 40px rgba(99, 102, 241, 0.2)',
                  '0 0 80px rgba(99, 102, 241, 0.1)'
                ].join(', ')
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Holographic glow overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 rounded-lg"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: isHovered 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
                : 'transparent'
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              background: isHovered
                ? 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)'
                : 'transparent',
              backgroundSize: isHovered ? '200% 100%' : '100% 100%',
              backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%',
            }}
            transition={{
              background: { duration: 0.3 },
              backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
            }}
            style={{
              maskImage: 'linear-gradient(to right, transparent 2px, black 2px, black calc(100% - 2px), transparent calc(100% - 2px)), linear-gradient(to bottom, transparent 2px, black 2px, black calc(100% - 2px), transparent calc(100% - 2px))',
              maskComposite: 'intersect',
            }}
          />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {project.project_name}
                  {/* Easter Egg Icon */}
                  {easterEgg && (
                    <motion.button
                      className="ml-3 relative"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <easterEgg.icon className="h-4 w-4 text-yellow-400 hover:text-yellow-300 transition-colors" />
                      
                      {/* Animated Tooltip */}
                      <AnimatePresence>
                        {showTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 border border-yellow-400/30 rounded-lg shadow-xl z-50"
                          >
                            <div className="text-yellow-400 font-semibold text-sm mb-1">
                              {easterEgg.fact}
                            </div>
                            <div className="text-gray-300 text-xs">
                              {easterEgg.stat}
                            </div>
                            {/* Tooltip arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(project.status)}`}>
                  {project.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Github className="h-5 w-5 text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors" />
                <ExternalLink className="h-5 w-5 text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Objective */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-sm font-semibold text-gray-300">Objective</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{project.objective}</p>
            </div>

            {/* Key Metrics - Conditional based on persona */}
            {showMetrics && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm font-semibold text-gray-300">Impact</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-medium">{value}</span>
                        <button
                          onClick={() => handleMetricClick(key, value)}
                          className="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded hover:bg-gray-800"
                          title="View metric details"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Testimonials - NEW SECTION */}
            {projectTestimonials.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Users className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-sm font-semibold text-gray-300">What Clients Say</span>
                </div>
                <div className="space-y-3">
                  {projectTestimonials.map((testimonial, idx) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-start space-x-2 mb-2">
                        <Quote className="h-3 w-3 text-purple-400 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-300 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          <span className="font-medium text-gray-300">{testimonial.author}</span>
                          <span className="mx-1">•</span>
                          <span>{testimonial.role}</span>
                          <span className="mx-1">•</span>
                          <span>{testimonial.company}</span>
                        </div>
                        {testimonial.impact && (
                          <div className="text-xs text-purple-400 font-medium">
                            {testimonial.impact}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack - Emphasized for developers */}
            <div className={`mb-4 ${emphasizeTechnical ? 'order-first' : ''}`}>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className={`px-2 py-1 text-xs rounded border ${
                      emphasizeTechnical 
                        ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700' 
                        : 'bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Expandable Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Zap className="h-4 w-4 mr-1" />
              System Architecture
              <ArrowRight className={`h-3 w-3 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>

            {/* Deep Dive Technical Button */}
            {archContent && (
              <button
                onClick={() => setShowArchModal(true)}
                className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors mt-2"
              >
                <Code className="h-4 w-4 mr-1" />
                [Lihat Arsitektur Inti]
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            )}
            <motion.div
              initial={false}
              animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-gray-700 mt-3">
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {project.system_architecture}
                </p>
                {project.visual_flow && (
                  <div className="bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Data Flow</div>
                    <div className="text-sm text-indigo-300 font-mono">
                      {project.visual_flow}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Metric Detail Modal */}
      {modalContent && (
        <MetricDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
          description={modalContent.description}
          details={modalContent.details}
          projectContext={modalContent.projectContext}
          verificationLevel={modalContent.verificationLevel}
        />
      )}

      {/* Architecture Deep Dive Modal */}
      <AnimatePresence>
        {showArchModal && archContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowArchModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Code className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">{archContent.title}</h3>
                </div>
                <button
                  onClick={() => setShowArchModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Architecture Diagram */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">System Diagram</h4>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre overflow-x-auto">
                      {archContent.diagram}
                    </pre>
                  </div>
                </div>

                {/* Code Example */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Implementation Example</h4>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre overflow-x-auto">
                      {archContent.codeSnippet}
                    </pre>
                  </div>
                </div>

                {/* Technical Notes */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Architecture Notes</h4>
                  <p className="text-sm text-gray-300">
                    This implementation demonstrates async-first patterns, modular design, and horizontal scaling capabilities.
                    Each component can be developed, tested, and deployed independently.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCaseStudy;