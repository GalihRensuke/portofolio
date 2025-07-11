import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { MessageCircle, X, Send, ArrowRight, Terminal, Zap, Move } from 'lucide-react';
import { useProactiveAITrigger } from '../hooks/useProactiveAITrigger';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  showSuggestions: boolean;
}

interface Position {
  x: number;
  y: number;
}

// PRODUCTION N8N WEBHOOK INTEGRATION
const sendMessageToWebhook = async (message: string, sessionId: string, userName?: string) => {
  const payload = {
    message,
    timestamp: new Date().toISOString(),
    sessionId,
    userName: userName || 'Portfolio Visitor',
    source: 'galyarder-portfolio-ai-concierge',
    domain: window.location.hostname
  };

  try {
    console.log('🔗 Connecting to Galyarder AI backend...');
    console.log('📤 Payload:', payload);
    
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook/b653569b-761b-40ad-870e-1cc3c12e8bd2';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Source': 'galyarder-portfolio-v4',
        'X-Session': sessionId
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      
      // Handle N8N webhook response format - it returns an array
      if (Array.isArray(data) && data.length > 0) {
        // Extract message from the first item in the array
        const responseItem = data[0];
        if (responseItem && responseItem.message) {
          console.log('✅ Real AI response received:', responseItem.message);
          return responseItem.message;
        }
      }
      
      // Fallback for other JSON formats
      console.log('✅ Real AI response received:', data);
      return data.message || data.output || data.response || 'Response received from Galyarder AI';
    } else {
      // Handle plain text response
      const textResponse = await response.text();
      console.log('✅ Real AI response received (text):', textResponse);
      return textResponse;
    }
    
  } catch (error) {
    console.error('❌ Webhook connection failed:', error);
    console.log('🔄 Falling back to enhanced mock response...');
    
    // Enhanced fallback with intelligent responses
    return generateIntelligentFallback(message);
  }
};

// Enhanced fallback system with intelligent responses
const generateIntelligentFallback = (message: string): string => {
  const input = message.toLowerCase().trim();
  
  // Welcome message fallback
  if (input === 'welcome_trigger') {
    return "Welcome! I am the digital interface for Galyarder. I have access to his project data, architectural principles, and availability. I can help you explore flagship partnership opportunities, discuss technical challenges, or provide information about his work. How can I assist you today?";
  }
  
  // Scheduling-specific responses
  if (input.includes('schedule') || input.includes('call') || input.includes('meeting') || input.includes('consultation')) {
    return "I can help you schedule a consultation with Galyarder. He's currently available for flagship project discussions and technical consultations. What type of project or challenge would you like to discuss? This will help me route your request appropriately.";
  }
  
  // Greeting responses
  if (input.includes('hello') || input.includes('hi') || input === 'yo' || input.includes('hey')) {
    return "I am the digital interface for Galyarder. I have access to his project data, architectural principles, and availability. How can I assist?";
  }
  
  // Flagship project inquiries
  if (input.includes('flagship') || input.includes('collaboration') || input.includes('partner')) {
    return "Galyarder is currently seeking a flagship partner for a high-impact project. The focus is on three core archetypes: Autonomous Sales Engine, Enterprise AI Brain, or Operational Automation Core. Would you like to explore if your challenge aligns with these areas?";
  }
  
  // Project-specific queries
  if (input.includes('airdrop') || input.includes('web3') || input.includes('defi')) {
    return "AirdropOps achieved 200% ROI improvement through intelligent automation. The system processes 50,000+ opportunities with 92% accuracy using LLM analysis and n8n workflow execution. This demonstrates the Operational Automation Core archetype. Would you like to discuss similar automation challenges?";
  }
  
  if (input.includes('ai') || input.includes('automation') || input.includes('workflow')) {
    return "Galyarder specializes in AI workflow automation and has automated 10,000+ processes with 90% reduction in manual operations. The Prompt Codex system demonstrates structured AI engineering. What specific automation challenges are you facing?";
  }
  
  // Architecture and technical
  if (input.includes('architecture') || input.includes('system') || input.includes('technical')) {
    return "Galyarder's architectural approach emphasizes async-first patterns, modular decomposition, and horizontal scaling. These principles are demonstrated across all projects. Would you like to explore specific architectural patterns or discuss your system design challenges?";
  }
  
  // Contact and scheduling
  if (input.includes('contact') || input.includes('schedule') || input.includes('call') || input.includes('meeting')) {
    return "You can schedule a consultation through the autonomous intake system, which qualifies opportunities and routes high-value projects directly to Galyarder. Would you like to proceed with the intake process?";
  }
  
  // Capabilities and experience
  if (input.includes('experience') || input.includes('skills') || input.includes('what') || input.includes('capabilities')) {
    return "Core expertise: 15+ smart contracts deployed, 10,000+ automated processes, 200% average efficiency gains. Current focus: finding a flagship partner for a definitive case study. What type of challenge are you working on?";
  }
  
  // Default intelligent response
  return "I can provide detailed information about Galyarder's projects, architectural principles, and collaboration opportunities. The current priority is identifying a flagship partner for a high-impact project. What specific aspect would you like to explore?";
};

// Optimized LogoGlyph component with reduced animations
const LogoGlyph = ({ isActive, onClick, isDragging }: { isActive: boolean; onClick: () => void; isDragging: boolean }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-12 h-12 sm:w-14 sm:h-14 cursor-pointer group touch-manipulation"
      whileHover={{ scale: isDragging ? 1 : 1.05 }}
      whileTap={{ scale: isDragging ? 1 : 0.95 }}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
    >
      {/* Simplified Logo Container */}
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-lg"
        animate={{
          scale: isActive ? [1, 1.01, 1] : [1, 1.005, 1], // Reduced animation intensity
        }}
        transition={{
          duration: isActive ? 4 : 8, // Increased duration to reduce frequency
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Simplified Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-xl"
          animate={{
            opacity: isActive ? [0.15, 0.25, 0.15] : [0.1, 0.15, 0.1], // Reduced opacity for better performance
          }}
          transition={{
            duration: 3, // Increased duration
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Logo Image */}
        <img
          src="/logo copy.png"
          alt="Galyarder Logo"
          className="w-full h-full object-contain p-1.5 sm:p-2"
          style={{
            filter: isActive ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.95) saturate(0.9)'
          }}
        />

        {/* Simplified border */}
        <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-xl" />
      </motion.div>

      {/* Simplified glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-xl blur-md -z-10"
        style={{
          opacity: isActive ? 0.4 : 0.2,
          transform: isActive ? 'scale(1.1)' : 'scale(1.05)'
        }}
      />

      {/* Status indicator */}
      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-lg border-2 border-gray-900" />

      {/* Drag indicator when dragging */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
        >
          <Move className="w-3 h-3 inline mr-1" />
          Drag to move
        </motion.div>
      )}
    </motion.button>
  );
};

const ProactiveAIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversation, setConversation] = useState<ConversationState>({
    messages: [],
    isTyping: false,
    showSuggestions: false
  });
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the proactive AI trigger hook
  const { currentMessage, clearCurrentMessage, isAITyping, setIsAITyping } = useProactiveAITrigger();

  // Optimized position initialization
  const updatePosition = useCallback(() => {
    const isMobile = window.innerWidth < 640;
    const padding = isMobile ? 16 : 32;
    
    setPosition({
      x: window.innerWidth - (isMobile ? 80 : 96) - padding,
      y: window.innerHeight - (isMobile ? 80 : 96) - padding
    });
  }, []);

  // Initialize position based on screen size
  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  // Handle proactive messages (disabled for performance)
  useEffect(() => {
    // Disabled proactive messages - AI only opens when clicked
  }, [currentMessage, isOpen]);

  // Optimized welcome message handling
  useEffect(() => {
    if (isOpen && !hasShownWelcome && conversation.messages.length === 0) {
      setHasShownWelcome(true);
      setConversation(prev => ({ ...prev, isTyping: true }));
      
      const welcomeTimer = setTimeout(async () => {
        try {
          // Send welcome trigger to n8n webhook
          const welcomeResponse = await sendMessageToWebhook("WELCOME_TRIGGER", sessionId, "Portfolio Visitor");
          streamAssistantMessage(welcomeResponse);
          setConversation(prev => ({ ...prev, showSuggestions: true }));
        } catch (error) {
          console.error('Failed to get welcome message:', error);
          // Fallback welcome message
          streamAssistantMessage("Welcome! I am the digital interface for Galyarder. I have access to his project data, architectural principles, and availability. I can help you explore flagship partnership opportunities or answer questions about his work. How can I assist you today?");
          setConversation(prev => ({ ...prev, showSuggestions: true }));
        } finally {
          setConversation(prev => ({ ...prev, isTyping: false }));
        }
      }, 800);

      return () => clearTimeout(welcomeTimer);
    }
  }, [isOpen, hasShownWelcome, conversation.messages.length, sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const addMessage = useCallback((type: 'user' | 'assistant', content: string, isStreaming: boolean = false) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isStreaming
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      showSuggestions: type === 'assistant' && !isStreaming
    }));
  }, []);

  // Optimized streaming with better cleanup
  const streamAssistantMessage = useCallback((fullContent: string) => {
    const messageId = Date.now().toString();
    const words = fullContent.split(' ');
    let currentWordIndex = 0;
    
    setIsAITyping(true);

    // Add an initial streaming message placeholder
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, { id: messageId, type: 'assistant', content: '', timestamp: new Date(), isStreaming: true }],
      isTyping: true,
      showSuggestions: false
    }));

    // Clear any existing streaming interval
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }

    streamingIntervalRef.current = setInterval(() => {
      if (currentWordIndex < words.length) {
        setConversation(prev => {
          const updatedMessages = prev.messages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, content: msg.content + (msg.content ? ' ' : '') + words[currentWordIndex] };
            }
            return msg;
          });
          return { ...prev, messages: updatedMessages };
        });
        currentWordIndex++;
      } else {
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setConversation(prev => {
          const updatedMessages = prev.messages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, isStreaming: false };
            }
            return msg;
          });
          return { ...prev, isTyping: false, showSuggestions: true, messages: updatedMessages };
        });
        setIsAITyping(false);
      }
    }, 80); // Increased interval for better performance
  }, [setIsAITyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    
    setConversation(prev => ({ ...prev, isTyping: true, showSuggestions: false }));

    try {
      console.log('🤖 Sending message to Galyarder AI:', userMessage);
      const response = await sendMessageToWebhook(userMessage, sessionId);
      streamAssistantMessage(response);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      streamAssistantMessage("I'm experiencing connectivity issues. Please try again or contact Galyarder directly at admin@galyarder.my.id");
    }
  }, [input, addMessage, sessionId, streamAssistantMessage]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Update position based on final drag position
    const newX = position.x + info.offset.x;
    const newY = position.y + info.offset.y;
    
    // Constrain to viewport bounds
    const isMobile = window.innerWidth < 640;
    const elementSize = isMobile ? 80 : 96;
    const padding = isMobile ? 16 : 32;
    
    const constrainedX = Math.max(padding, Math.min(window.innerWidth - elementSize - padding, newX));
    const constrainedY = Math.max(padding, Math.min(window.innerHeight - elementSize - padding, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  // Parse CTA links in messages
  const parseMessageContent = (content: string) => {
    // Parse [Button Text](URL) format
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // Add the link
      parts.push({
        type: 'link',
        text: match[1],
        url: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  // Get chat window dimensions based on screen size
  const getChatDimensions = () => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    
    if (isMobile) {
      return {
        width: 'calc(100vw - 2rem)',
        height: 'calc(100vh - 8rem)',
        maxWidth: '100%',
        maxHeight: '100%'
      };
    } else if (isTablet) {
      return {
        width: '380px',
        height: '500px',
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 4rem)'
      };
    } else {
      return {
        width: '420px',
        height: '600px',
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 4rem)'
      };
    }
  };

  const chatDimensions = getChatDimensions();

  const suggestions = [
    "Tell me about flagship partnership opportunities",
    "I have a sales automation challenge", 
    "We need to organize our internal knowledge",
    "Help us eliminate manual operations"
  ];

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  return (
    <>
      {/* Audio element for subtle feedback */}
      <audio ref={audioRef} src="/subtle_sound.mp3" preload="auto" />

      {/* Viewport constraints for dragging */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

      {/* Floating Logo Glyph - Draggable */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: position.x,
              y: position.y
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-0 left-0 z-50 touch-manipulation"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            whileDrag={{ 
              scale: 1.1,
              zIndex: 60,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            <div className="relative">
              <LogoGlyph 
                isActive={false} 
                onClick={() => !isDragging && setIsOpen(true)}
                isDragging={isDragging}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Chat Interface - Fully Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl flex flex-col"
            style={{
              top: Math.max(20, position.y - (window.innerWidth < 640 ? 300 : 350)),
              left: Math.max(20, Math.min(window.innerWidth - (window.innerWidth < 640 ? 340 : 440), position.x - 200)),
              width: chatDimensions.width,
              height: chatDimensions.height,
              maxWidth: chatDimensions.maxWidth,
              maxHeight: chatDimensions.maxHeight
            }}
          >
            {/* Header - Mobile optimized */}
            <div className="flex items-center justify-between p-3 sm:p-5 border-b border-gray-700/50 bg-gray-800/80 rounded-t-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <LogoGlyph 
                    isActive={true} 
                    onClick={() => {}}
                    isDragging={false}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Galyarder AI</h3>
                  <p className="text-xs text-gray-400 truncate">the digital interface for Galyarder</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50 flex-shrink-0 touch-manipulation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages - Mobile optimized scrolling */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {conversation.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-gray-800/80 text-gray-200 border border-gray-700/50 shadow-md'
                    }`}
                  >
                    {message.type === 'assistant' ? (
                      <div>
                        {parseMessageContent(message.content).map((part, index) => (
                          <span key={index}>
                            {part.type === 'text' ? (
                              part.content
                            ) : (
                              <a
                                href={part.url}
                                className="inline-flex items-center px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors mx-1"
                                onClick={() => {
                                  if (part.url.startsWith('/')) {
                                    window.location.href = part.url;
                                  } else {
                                    window.open(part.url, '_blank');
                                  }
                                }}
                              >
                                {part.text}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}

              {conversation.isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/80 border border-gray-700/50 p-3 sm:p-4 rounded-xl shadow-md">
                    <div className="flex items-center space-x-2">
                      <TypingIndicator />
                      <span className="text-gray-400 text-xs">Galyarder AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Suggestions - Mobile optimized */}
              {conversation.showSuggestions && conversation.messages.length > 0 && !conversation.isTyping && (
                <div className="space-y-2 sm:space-y-3 pt-2">
                  <p className="text-xs text-gray-400 flex items-center font-medium">
                    <Terminal className="w-3 h-3 mr-2" />
                    Flagship partner queries:
                  </p>
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestion(suggestion)}
                      className="block w-full text-left p-2 sm:p-3 text-xs bg-gray-800/60 hover:bg-gray-700/80 rounded-lg border border-gray-700/30 hover:border-indigo-500/50 text-gray-300 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Input - Mobile optimized */}
            <div className="p-3 sm:p-5 border-t border-gray-700/50 bg-gray-800/80 rounded-b-xl">
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about projects, architecture, or collaboration..."
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm shadow-inner touch-manipulation"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || conversation.isTyping}
                  className="px-3 py-2 sm:px-4 sm:py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg hover:shadow-xl touch-manipulation"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.button>
              </div>
              
              {/* Connection Status */}
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Connected to Galyarder AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProactiveAIConcierge;