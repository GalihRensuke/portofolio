import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { Search, Brain, FileText, ExternalLink, Loader, Zap, Code, Target, Database } from 'lucide-react';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

interface QueryResult {
  id: string;
  title: string;
  content: string;
  source: string;
  relevance: number;
  url?: string;
  category: 'architecture' | 'project' | 'principle' | 'technical';
}

// Comprehensive knowledge base with real content from the portfolio
const knowledgeBase: QueryResult[] = [
  // Architecture & Design Patterns
  {
    id: 'async-architecture',
    title: 'Async-First Architecture Patterns',
    content: 'Event-driven systems with non-blocking operations using message queues, event sourcing, and circuit breakers. Implemented in AirdropOps workflow orchestration and GalyarderOS routine automation.',
    source: 'System Architecture Blueprint',
    relevance: 0.95,
    category: 'architecture',
    url: '/blueprint'
  },
  {
    id: 'modular-design',
    title: 'Modular System Design',
    content: 'Composable components with single responsibilities using microservices, plugin architectures, and dependency injection. Demonstrated in Prompt Codex DSL components and GalyarderOS module system.',
    source: 'Architecture Principles',
    relevance: 0.92,
    category: 'architecture',
    url: '/blueprint'
  },
  {
    id: 'scaling-patterns',
    title: 'Build-to-Scale Principles',
    content: 'Horizontal scaling patterns from day one with load balancing, database sharding, and CDN optimization. Applied in AirdropOps multi-chain processing and real-time analytics pipelines.',
    source: 'Scalability Framework',
    relevance: 0.90,
    category: 'architecture',
    url: '/blueprint'
  },

  // Project Case Studies
  {
    id: 'airdropops',
    title: 'AirdropOps: Web3 Automation System',
    content: 'Intelligent automation pipeline processing 50,000+ opportunities with 92% accuracy and 200% ROI improvement. Event-driven architecture: Telegram monitoring → LLM analysis → n8n workflow execution → Multi-chain transaction processing.',
    source: 'Project Case Study',
    relevance: 0.98,
    category: 'project',
    url: '/projects#airdropops'
  },
  {
    id: 'galyarderos',
    title: 'GalyarderOS: Personal Productivity System',
    content: 'Unified system architecture eliminating cognitive overhead with 85% reduction in decision fatigue and 2.5 hours daily time savings. Modular microservices with React frontend, Supabase backend, and AI-powered automation layer.',
    source: 'Project Case Study',
    relevance: 0.96,
    category: 'project',
    url: '/projects#galyarderos'
  },
  {
    id: 'prompt-codex',
    title: 'Prompt Codex: AI Workflow System',
    content: 'DSL-based prompt composition system reducing AI workflow development time by 70%. Features version control, A/B testing framework, and performance analytics with modular prompt components.',
    source: 'Project Case Study',
    relevance: 0.94,
    category: 'project',
    url: '/sandbox'
  },

  // Technical Implementation
  {
    id: 'smart-contracts',
    title: 'Smart Contract Development',
    content: '15+ smart contracts deployed with comprehensive testing via Foundry. Security-first approach with formal verification patterns, reentrancy guards, and checks-effects-interactions pattern.',
    source: 'Technical Expertise',
    relevance: 0.88,
    category: 'technical',
    url: '/stack'
  },
  {
    id: 'ai-automation',
    title: 'AI Workflow Automation',
    content: '10,000+ processes automated using LLM integration for decision-making, content generation, and workflow orchestration. Achieved 90% reduction in manual operations.',
    source: 'Technical Capabilities',
    relevance: 0.86,
    category: 'technical',
    url: '/about'
  },
  {
    id: 'n8n-workflows',
    title: 'n8n Automation Patterns',
    content: 'Effective n8n workflows following async patterns with error handling and retry logic. Webhook triggers for external events, circuit breakers for API calls, and database state management.',
    source: 'Automation Playbook',
    relevance: 0.84,
    category: 'technical',
    url: '/stack'
  },

  // Mental Models & Principles
  {
    id: 'first-principles',
    title: 'First Principles Thinking',
    content: 'Breaking down complex problems to fundamentals for systematic decision-making. Applied in technical debt evaluation matrices and risk assessment frameworks.',
    source: 'Mental Operating Systems',
    relevance: 0.82,
    category: 'principle',
    url: '/blueprint'
  },
  {
    id: 'systems-thinking',
    title: 'Systems Thinking Framework',
    content: 'Understanding interconnections and feedback loops in complex systems. Emphasis on problem decomposition, constraint identification, and success metric definition.',
    source: 'Decision Framework',
    relevance: 0.80,
    category: 'principle',
    url: '/blueprint'
  },
  {
    id: 'operating-principles',
    title: 'Operating Principles',
    content: 'Clear > Clever, Substance > Style, Systems > Stories, Structure > Personality, Utility > Trend. Focus on proven tools over latest frameworks.',
    source: 'Core Philosophy',
    relevance: 0.78,
    category: 'principle',
    url: '/about'
  },

  // Tech Stack & Tools
  {
    id: 'frontend-stack',
    title: 'Frontend Technology Stack',
    content: 'React, Next.js, Tailwind CSS, shadcn/ui, Vite, TypeScript for component-based UI development with type safety and modern tooling.',
    source: 'Technology Stack',
    relevance: 0.76,
    category: 'technical',
    url: '/stack'
  },
  {
    id: 'backend-infrastructure',
    title: 'Backend & Infrastructure',
    content: 'Supabase, Cloudflare, PostgreSQL, n8n, Docker, Vercel for scalable backend services with edge computing and workflow automation.',
    source: 'Technology Stack',
    relevance: 0.74,
    category: 'technical',
    url: '/stack'
  },
  {
    id: 'ai-tools',
    title: 'AI & Machine Learning Tools',
    content: 'OpenRouter, Gemini Pro, LangChain, Whisper, GPT-4, Embeddings for unified LLM access, multimodal AI, and vector search capabilities.',
    source: 'AI Technology Stack',
    relevance: 0.72,
    category: 'technical',
    url: '/stack'
  },

  // Collaboration & Process
  {
    id: 'collaboration-approach',
    title: 'Collaboration Framework',
    content: 'High-value technical partnerships with async-first communication, documentation-driven development, and measurable outcome agreements.',
    source: 'Working Methods',
    relevance: 0.70,
    category: 'principle',
    url: '/about'
  },
  {
    id: 'autonomous-intake',
    title: 'Autonomous Client Qualification',
    content: 'Intelligent intake system that fast-tracks high-value opportunities ($15K+) while filtering low-value inquiries. Includes lead scoring and automated routing.',
    source: 'Business Process',
    relevance: 0.68,
    category: 'project',
    url: '/contact'
  }
];

const SemanticQuery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setLastSemanticQuery, setSemanticQueryResultCount } = useUserBehaviorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      setSemanticQueryResultCount(0);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Advanced search algorithm with multiple matching strategies
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 2);
    
    const searchResults = knowledgeBase
      .map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        const sourceLower = item.source.toLowerCase();
        
        // Exact phrase matching (highest priority)
        if (titleLower.includes(searchQuery.toLowerCase())) score += 100;
        if (contentLower.includes(searchQuery.toLowerCase())) score += 80;
        
        // Individual term matching
        searchTerms.forEach(term => {
          if (titleLower.includes(term)) score += 50;
          if (contentLower.includes(term)) score += 30;
          if (sourceLower.includes(term)) score += 20;
        });
        
        // Category-based boosting
        if (searchQuery.toLowerCase().includes('project') && item.category === 'project') score += 40;
        if (searchQuery.toLowerCase().includes('architecture') && item.category === 'architecture') score += 40;
        if (searchQuery.toLowerCase().includes('technical') && item.category === 'technical') score += 40;
        if (searchQuery.toLowerCase().includes('principle') && item.category === 'principle') score += 40;
        
        // Specific keyword boosting
        const keywords = {
          'airdrop': ['airdropops'],
          'web3': ['airdropops', 'smart-contracts'],
          'defi': ['airdropops', 'smart-contracts'],
          'ai': ['prompt-codex', 'ai-automation', 'ai-tools'],
          'automation': ['galyarderos', 'n8n-workflows', 'ai-automation'],
          'productivity': ['galyarderos'],
          'prompt': ['prompt-codex'],
          'async': ['async-architecture'],
          'modular': ['modular-design'],
          'scale': ['scaling-patterns'],
          'react': ['frontend-stack'],
          'supabase': ['backend-infrastructure']
        };
        
        Object.entries(keywords).forEach(([keyword, itemIds]) => {
          if (searchQuery.toLowerCase().includes(keyword) && itemIds.includes(item.id)) {
            score += 60;
          }
        });
        
        return { ...item, searchScore: score };
      })
      .filter(item => item.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 8)
      .map(({ searchScore, ...item }) => ({
        ...item,
        relevance: Math.min(searchScore / 100, 1)
      }));
    
    setResults(searchResults);
    setSelectedIndex(0);
    setIsSearching(false);
    
    // Update behavior store and award points for search
    setLastSemanticQuery(searchQuery);
    setSemanticQueryResultCount(searchResults.length);
    incrementEngagementScore(ENGAGEMENT_SCORING.SEMANTIC_QUERY);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (result: QueryResult) => {
    if (result.url) {
      if (result.url.startsWith('http')) {
        window.open(result.url, '_blank');
      } else {
        window.location.href = result.url;
      }
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'architecture': return Brain;
      case 'project': return Zap;
      case 'technical': return Code;
      case 'principle': return Target;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'architecture': return 'text-purple-400';
      case 'project': return 'text-blue-400';
      case 'technical': return 'text-green-400';
      case 'principle': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors w-full"
      >
        <Search className="h-4 w-4" />
        <span>Search knowledge base</span>
        <div className="flex space-x-1 ml-auto">
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded">K</kbd>
        </div>
      </button>

      {/* Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-700">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <Command.Input
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search architecture, projects, principles, tech stack..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader className="h-4 w-4 text-indigo-400 animate-spin ml-2" />
                  )}
                </div>

                <Command.List className="max-h-96 overflow-y-auto">
                  {query && !isSearching && results.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{query}"</p>
                      <p className="text-sm mt-1">Try: "async architecture", "airdropops", "ai automation", "tech stack"</p>
                    </div>
                  )}

                  {results.map((result, index) => {
                    const CategoryIcon = getCategoryIcon(result.category);
                    const categoryColor = getCategoryColor(result.category);
                    
                    return (
                      <Command.Item
                        key={result.id}
                        value={result.id}
                        onSelect={() => handleSelect(result)}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-800 last:border-b-0 ${
                          index === selectedIndex ? 'bg-gray-800' : 'hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <CategoryIcon className={`h-5 w-5 ${categoryColor} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {result.title}
                              </h3>
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                <span className="text-xs text-gray-400 capitalize">
                                  {result.category}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {Math.round(result.relevance * 100)}%
                                </span>
                                {result.url && (
                                  <ExternalLink className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                              {result.content}
                            </p>
                            <span className="text-xs text-indigo-400">
                              {result.source}
                            </span>
                          </div>
                        </div>
                      </Command.Item>
                    );
                  })}
                </Command.List>

                {!query && (
                  <div className="px-4 py-6 text-center text-gray-400">
                    <Database className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-1">Search Knowledge Base</p>
                    <p className="text-sm mb-4">
                      Query architecture patterns, project case studies, technical implementations, and core principles
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-800 rounded">async architecture</span>
                      <span className="px-2 py-1 bg-gray-800 rounded">airdropops</span>
                      <span className="px-2 py-1 bg-gray-800 rounded">ai automation</span>
                      <span className="px-2 py-1 bg-gray-800 rounded">tech stack</span>
                    </div>
                  </div>
                )}

                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Semantic search • {knowledgeBase.length} entries indexed</span>
                    <div className="flex space-x-2">
                      <span>Press <kbd className="px-1 bg-gray-700 rounded">↵</kbd> to open</span>
                      <span><kbd className="px-1 bg-gray-700 rounded">esc</kbd> to close</span>
                    </div>
                  </div>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SemanticQuery;