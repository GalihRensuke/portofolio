export interface GalyarderInsight {
  text: string;
  contextKeywords: string[];
  category: 'principle' | 'observation' | 'methodology' | 'philosophy';
}

export const galyarderInsights: GalyarderInsight[] = [
  // Architectural Principles
  {
    text: "Clear > Clever. The most elegant solution is often the one that can be understood by your future self at 3 AM.",
    contextKeywords: ['principles', 'philosophy', 'architecture', 'design'],
    category: 'principle'
  },
  {
    text: "Systems thinking reveals that the bottleneck is rarely where you think it is. Look for the constraint that constrains the constraint.",
    contextKeywords: ['systems-thinking', 'architecture', 'optimization', 'performance'],
    category: 'methodology'
  },
  {
    text: "Async-first architecture isn't just about performance—it's about building systems that can evolve without breaking.",
    contextKeywords: ['async', 'architecture', 'scalability', 'evolution'],
    category: 'principle'
  },
  {
    text: "The best automation eliminates decisions, not just tasks. Reduce cognitive overhead, not just manual work.",
    contextKeywords: ['automation', 'ai', 'efficiency', 'cognitive'],
    category: 'observation'
  },
  {
    text: "Modularity is not about code organization—it's about enabling independent evolution of system components.",
    contextKeywords: ['modularity', 'architecture', 'evolution', 'components'],
    category: 'principle'
  },

  // Project Insights
  {
    text: "Every project should answer: What manual process becomes impossible to do manually after this system exists?",
    contextKeywords: ['projects', 'automation', 'impact', 'transformation'],
    category: 'methodology'
  },
  {
    text: "ROI isn't just about efficiency gains—it's about enabling capabilities that were previously impossible.",
    contextKeywords: ['roi', 'impact', 'projects', 'value'],
    category: 'observation'
  },
  {
    text: "The most successful systems are those that make their users more intelligent, not just more efficient.",
    contextKeywords: ['ai', 'intelligence', 'systems', 'enhancement'],
    category: 'philosophy'
  },

  // Mental Models
  {
    text: "First principles thinking: Strip away assumptions until you reach the irreducible core. Build from there.",
    contextKeywords: ['first-principles', 'thinking', 'methodology', 'analysis'],
    category: 'methodology'
  },
  {
    text: "The map is not the territory, but a good mental model is a map that helps you navigate unknown territory.",
    contextKeywords: ['mental-models', 'thinking', 'navigation', 'understanding'],
    category: 'philosophy'
  },
  {
    text: "Complex systems fail in complex ways. Design for graceful degradation, not perfect operation.",
    contextKeywords: ['complexity', 'failure', 'resilience', 'design'],
    category: 'principle'
  },

  // Implementation Wisdom
  {
    text: "Build systems that compound intelligence over time. Each interaction should make the system smarter.",
    contextKeywords: ['intelligence', 'learning', 'compound', 'evolution'],
    category: 'principle'
  },
  {
    text: "The best interfaces are invisible. Users should feel more capable, not more confused.",
    contextKeywords: ['interface', 'usability', 'design', 'experience'],
    category: 'observation'
  },
  {
    text: "Security is not a feature—it's a fundamental property that emerges from good architectural decisions.",
    contextKeywords: ['security', 'architecture', 'fundamentals', 'design'],
    category: 'principle'
  },

  // Collaboration Philosophy
  {
    text: "The highest leverage comes from building systems that make other people more effective at what they do best.",
    contextKeywords: ['collaboration', 'leverage', 'effectiveness', 'systems'],
    category: 'philosophy'
  },
  {
    text: "Documentation is not about explaining what the code does—it's about explaining why it exists.",
    contextKeywords: ['documentation', 'communication', 'purpose', 'clarity'],
    category: 'methodology'
  },

  // Technical Excellence
  {
    text: "Premature optimization is the root of all evil, but premature complexity is the root of all technical debt.",
    contextKeywords: ['optimization', 'complexity', 'technical-debt', 'engineering'],
    category: 'observation'
  },
  {
    text: "The best code is code that doesn't need to be written. The second best is code that explains itself.",
    contextKeywords: ['code', 'simplicity', 'clarity', 'engineering'],
    category: 'principle'
  },
  {
    text: "Measure what matters, but remember: not everything that matters can be measured, and not everything that can be measured matters.",
    contextKeywords: ['metrics', 'measurement', 'value', 'assessment'],
    category: 'philosophy'
  }
];

// Helper function to get relevant insights based on context
export const getRelevantInsights = (contextKeywords: string[], count: number = 1): GalyarderInsight[] => {
  const relevantInsights = galyarderInsights.filter(insight =>
    insight.contextKeywords.some(keyword =>
      contextKeywords.some(contextKeyword =>
        keyword.toLowerCase().includes(contextKeyword.toLowerCase()) ||
        contextKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  );

  // If no relevant insights found, return random insights
  const insightsToChooseFrom = relevantInsights.length > 0 ? relevantInsights : galyarderInsights;
  
  // Shuffle and return requested count
  const shuffled = [...insightsToChooseFrom].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get insights by category
export const getInsightsByCategory = (category: GalyarderInsight['category']): GalyarderInsight[] => {
  return galyarderInsights.filter(insight => insight.category === category);
};