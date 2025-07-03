export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  relatedProjectId?: string;
  relatedExpertiseId?: string;
  category: 'project' | 'expertise' | 'general';
  impact?: string;
}

export const testimonials: Testimonial[] = [
  // Project-related testimonials
  {
    id: 'airdrop-ops-1',
    quote: "The automation system Galyarder built transformed our Web3 operations completely. We went from manually screening 10 opportunities per day to processing 500+ with 92% accuracy. The ROI improvement was immediate and substantial.",
    author: "Marcus Chen",
    role: "Head of Operations",
    company: "DeFi Ventures",
    relatedProjectId: 'airdropops',
    category: 'project',
    impact: '200% ROI improvement'
  },
  {
    id: 'airdrop-ops-2',
    quote: "What impressed me most was the systematic approach to risk management. The LLM analysis caught edge cases our manual process consistently missed. It's not just automation—it's intelligent automation.",
    author: "Sarah Rodriguez",
    role: "Risk Management Director",
    company: "Crypto Capital",
    relatedProjectId: 'airdropops',
    category: 'project',
    impact: '53% accuracy improvement'
  },
  {
    id: 'galyarderos-1',
    quote: "The personal productivity system eliminated decision fatigue I didn't even realize I had. My cognitive load dropped dramatically, allowing me to focus on high-value strategic work instead of routine coordination.",
    author: "David Kim",
    role: "Technical Founder",
    company: "Neural Systems",
    relatedProjectId: 'galyarderos',
    category: 'project',
    impact: '85% decision fatigue reduction'
  },
  {
    id: 'prompt-codex-1',
    quote: "The DSL-based prompt system revolutionized our AI workflow development. What used to take hours now takes minutes, and the consistency is remarkable. It's like having a compiler for AI prompts.",
    author: "Elena Vasquez",
    role: "AI Engineering Lead",
    company: "Cognitive Labs",
    relatedProjectId: 'prompt-codex',
    category: 'project',
    impact: '70% development time reduction'
  },

  // Expertise-related testimonials
  {
    id: 'smart-contracts-1',
    quote: "Galyarder's smart contract architecture is bulletproof. The security patterns and formal verification approach gave us confidence to deploy with significant value at stake. Zero incidents in production.",
    author: "Alex Thompson",
    role: "Protocol Engineer",
    company: "DeFi Protocol Labs",
    relatedExpertiseId: 'smart-contracts',
    category: 'expertise',
    impact: '15+ contracts deployed'
  },
  {
    id: 'ai-automation-1',
    quote: "The AI workflow automation eliminated 90% of our manual operations. The system doesn't just follow rules—it makes intelligent decisions based on context and learns from outcomes.",
    author: "Maria Santos",
    role: "Operations Director",
    company: "Scale Dynamics",
    relatedExpertiseId: 'ai-automation',
    category: 'expertise',
    impact: '10,000+ processes automated'
  },
  {
    id: 'architecture-1',
    quote: "The async-first architecture patterns Galyarder implemented scaled seamlessly from prototype to production. The system handles 10x our original traffic without breaking a sweat.",
    author: "James Wilson",
    role: "CTO",
    company: "Growth Systems",
    relatedExpertiseId: 'architecture',
    category: 'expertise',
    impact: '200% efficiency gains'
  },
  {
    id: 'execution-1',
    quote: "What sets Galyarder apart is the focus on measurable outcomes. Every system delivered exceeded performance targets and came with comprehensive metrics to prove it.",
    author: "Lisa Chang",
    role: "Product Director",
    company: "Metrics Corp",
    relatedExpertiseId: 'execution',
    category: 'expertise',
    impact: '3+ production systems'
  },

  // General testimonials
  {
    id: 'general-1',
    quote: "Working with Galyarder is like having a systems architect who thinks in first principles. Every solution is elegant, scalable, and built to last.",
    author: "Robert Martinez",
    role: "Engineering Manager",
    company: "Tech Innovations",
    category: 'general'
  },
  {
    id: 'general-2',
    quote: "The level of systematic thinking and architectural precision is exceptional. Galyarder doesn't just build solutions—he builds systems that evolve and improve over time.",
    author: "Jennifer Lee",
    role: "VP of Engineering",
    company: "Future Systems",
    category: 'general'
  }
];

// Helper functions for filtering testimonials
export const getTestimonialsByProject = (projectId: string): Testimonial[] => {
  return testimonials.filter(t => t.relatedProjectId === projectId);
};

export const getTestimonialsByExpertise = (expertiseId: string): Testimonial[] => {
  return testimonials.filter(t => t.relatedExpertiseId === expertiseId);
};

export const getGeneralTestimonials = (): Testimonial[] => {
  return testimonials.filter(t => t.category === 'general');
};