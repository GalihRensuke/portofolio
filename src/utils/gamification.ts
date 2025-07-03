export type ClearanceLevel = 'Explorer' | 'Analyst' | 'Architect';

export interface ClearanceLevelInfo {
  level: ClearanceLevel;
  minScore: number;
  maxScore: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  benefits: string[];
}

export const clearanceLevels: ClearanceLevelInfo[] = [
  {
    level: 'Explorer',
    minScore: 0,
    maxScore: 49,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    description: 'Beginning to explore the system architecture and capabilities',
    benefits: [
      'Access to basic project information',
      'Standard response times',
      'General documentation access'
    ]
  },
  {
    level: 'Analyst',
    minScore: 50,
    maxScore: 99,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    description: 'Demonstrating deeper engagement with technical concepts',
    benefits: [
      'Access to detailed technical specifications',
      'Priority support responses',
      'Advanced documentation sections',
      'Architectural deep-dives'
    ]
  },
  {
    level: 'Architect',
    minScore: 100,
    maxScore: Infinity,
    color: 'text-gold-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    description: 'Achieved mastery-level understanding of system principles',
    benefits: [
      'Full access to all technical content',
      'Exclusive architectural diagrams',
      'Implementation case studies',
      'Direct consultation opportunities',
      'Flagship project consideration'
    ]
  }
];

export const getClearanceLevel = (score: number): ClearanceLevelInfo => {
  return clearanceLevels.find(level => 
    score >= level.minScore && score <= level.maxScore
  ) || clearanceLevels[0];
};

export const getProgressToNextLevel = (score: number): { 
  current: ClearanceLevelInfo; 
  next: ClearanceLevelInfo | null; 
  progress: number;
  pointsNeeded: number;
} => {
  const current = getClearanceLevel(score);
  const currentIndex = clearanceLevels.findIndex(level => level.level === current.level);
  const next = currentIndex < clearanceLevels.length - 1 ? clearanceLevels[currentIndex + 1] : null;
  
  if (!next) {
    return {
      current,
      next: null,
      progress: 100,
      pointsNeeded: 0
    };
  }
  
  const pointsInCurrentLevel = score - current.minScore;
  const pointsNeededForNextLevel = next.minScore - current.minScore;
  const progress = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  const pointsNeeded = next.minScore - score;
  
  return {
    current,
    next,
    progress: Math.min(progress, 100),
    pointsNeeded: Math.max(pointsNeeded, 0)
  };
};

export const getEngagementScore = (): number => {
  const stored = localStorage.getItem('galyarder_engagement_score');
  return stored ? parseInt(stored, 10) : 0;
};

export const setEngagementScore = (score: number): void => {
  localStorage.setItem('galyarder_engagement_score', score.toString());
};

export const incrementEngagementScore = (points: number): number => {
  const currentScore = getEngagementScore();
  const newScore = currentScore + points;
  setEngagementScore(newScore);
  return newScore;
};

// Engagement scoring rules
export const ENGAGEMENT_SCORING = {
  TIME_ON_PAGE: 1, // 1 point per 15 seconds
  BLUEPRINT_NODE_CLICK: 5, // 5 points per node clicked
  SANDBOX_USAGE: 10, // 10 points per prompt generated
  SEMANTIC_QUERY: 3, // 3 points per search query
  PAGE_VISIT: 2, // 2 points per unique page visit
  SCROLL_DEPTH_75: 5, // 5 points for scrolling 75% of page
  SCROLL_DEPTH_100: 10, // 10 points for scrolling to bottom
} as const;