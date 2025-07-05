import { useEffect, useState } from 'react';
import { useUserBehaviorStore } from '../store/userBehaviorStore';

export interface ProactiveMessage {
  id: string;
  content: string;
  type: 'project_interest' | 'philosophy_exploration' | 'failed_search' | 'flagship_opportunity';
  timestamp: number;
  cta?: {
    text: string;
    url: string;
  };
}

export const useProactiveAITrigger = () => {
  const [triggeredMessages, setTriggeredMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ProactiveMessage | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const {
    currentPage,
    timeOnPage,
    scrollDepth,
    nodesClickedInBlueprint,
    lastSemanticQuery,
    semanticQueryResultCount
  } = useUserBehaviorStore();

  // Project Interest Trigger
  useEffect(() => {
    const triggerId = 'project_interest';
    if (
      currentPage === '/projects' &&
      timeOnPage > 30000 && // 30 seconds
      !triggeredMessages.includes(triggerId)
    ) {
      const message: ProactiveMessage = {
        id: triggerId,
        content: "I notice you're exploring the project case studies. Would you like me to break down the architectural patterns or discuss how these solutions might apply to your specific challenges?",
        type: 'project_interest',
        timestamp: Date.now(),
        cta: {
          text: "Discuss Architecture Patterns",
          url: "/blueprint"
        }
      };
      
      setCurrentMessage(message);
      setTriggeredMessages(prev => [...prev, triggerId]);
    }
  }, [currentPage, timeOnPage, triggeredMessages]);

  // Philosophy Exploration Trigger
  useEffect(() => {
    const triggerId = 'philosophy_exploration';
    if (
      currentPage === '/blueprint' &&
      scrollDepth > 75 &&
      !triggeredMessages.includes(triggerId)
    ) {
      const message: ProactiveMessage = {
        id: triggerId,
        content: "You've explored the core architectural principles deeply. These patterns form the foundation of all my system designs. Would you like to discuss how they apply to your specific domain or see them in action?",
        type: 'philosophy_exploration',
        timestamp: Date.now(),
        cta: {
          text: "See Principles in Action",
          url: "/sandbox"
        }
      };
      
      setCurrentMessage(message);
      setTriggeredMessages(prev => [...prev, triggerId]);
    }
  }, [currentPage, scrollDepth, triggeredMessages]);

  // Failed Search Trigger
  useEffect(() => {
    const triggerId = 'failed_search';
    if (
      semanticQueryResultCount === 0 &&
      lastSemanticQuery.length > 0 &&
      !triggeredMessages.includes(triggerId)
    ) {
      const message: ProactiveMessage = {
        id: triggerId,
        content: `I couldn't find specific results for "${lastSemanticQuery}". Let me suggest some related topics or help you refine your search. What specific aspect are you most interested in?`,
        type: 'failed_search',
        timestamp: Date.now(),
        cta: {
          text: "Explore Related Topics",
          url: "/about"
        }
      };
      
      setCurrentMessage(message);
      setTriggeredMessages(prev => [...prev, triggerId]);
    }
  }, [semanticQueryResultCount, lastSemanticQuery, triggeredMessages]);

  // Flagship Opportunity Trigger
  useEffect(() => {
    const triggerId = 'flagship_opportunity';
    if (
      nodesClickedInBlueprint.length >= 3 &&
      timeOnPage > 45000 && // 45 seconds
      !triggeredMessages.includes(triggerId)
    ) {
      const message: ProactiveMessage = {
        id: triggerId,
        content: "Your deep exploration of the system architecture suggests you're working on complex challenges. I'm currently seeking a flagship partner for a high-impact project. Would you like to explore if your challenge aligns with the three core archetypes?",
        type: 'flagship_opportunity',
        timestamp: Date.now(),
        cta: {
          text: "Propose a Flagship Project",
          url: "/contact?intent=flagship&source=ai_concierge"
        }
      };
      
      setCurrentMessage(message);
      setTriggeredMessages(prev => [...prev, triggerId]);
    }
  }, [nodesClickedInBlueprint.length, timeOnPage, triggeredMessages]);

  const clearCurrentMessage = () => {
    setCurrentMessage(null);
    setIsAITyping(false);
  };

  const resetTriggers = () => {
    setTriggeredMessages([]);
    setCurrentMessage(null);
  };

  return {
    currentMessage,
    isAITyping,
    setIsAITyping,
    clearCurrentMessage,
    resetTriggers,
    triggeredMessages
  };
};