import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { MessageCircle, X, Send, Loader, ArrowRight, Terminal, Zap, Move, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useProactiveAITrigger } from '../hooks/useProactiveAITrigger';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
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

const LogoGlyph = ({ isActive, onClick, isDragging }: { isActive: boolean; onClick: () => void; isDragging: boolean }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-12 h-12 sm:w-14 sm:h-14 cursor-pointer group touch-manipulation"
      whileHover={{ scale: isDragging ? 1 : 1.05 }}
      whileTap={{ scale: isDragging ? 1 : 0.95 }}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
    >
      {/* Logo Container with Animations */}
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-lg"
        animate={{
          rotateY: isActive ? [0, 5, -5, 0] : [0, 2, -2, 0],
          scale: isActive ? [1, 1.02, 1] : [1, 1.01, 1],
        }}
        transition={{
          duration: isActive ? 3 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Background with gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl"
          animate={{
            opacity: isActive ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Logo Image */}
        <motion.img
          src="/logo copy.png"
          alt="Galyarder Logo"
          className="w-full h-full object-contain p-1.5 sm:p-2"
          animate={{
            filter: isActive 
              ? ["brightness(1) saturate(1)", "brightness(1.1) saturate(1.2)", "brightness(1) saturate(1)"]
              : ["brightness(0.9) saturate(0.8)", "brightness(1) saturate(1)", "brightness(0.9) saturate(0.8)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 border-2 border-indigo-500/30 rounded-xl"
          animate={{
            borderColor: isActive 
              ? ["rgba(99, 102, 241, 0.3)", "rgba(99, 102, 241, 0.6)", "rgba(99, 102, 241, 0.3)"]
              : ["rgba(99, 102, 241, 0.2)", "rgba(99, 102, 241, 0.4)", "rgba(99, 102, 241, 0.2)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-xl blur-md -z-10"
        animate={{
          opacity: isActive ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
          scale: isActive ? [1, 1.2, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Status indicator */}
      <motion.div
        className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-lg border-2 border-gray-900"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Pulse ring animation */}
      <motion.div
        className="absolute -inset-1 border-2 border-indigo-400/50 rounded-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

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

// Updated CORS proxy function using api.allorigins.win
const sendMessageToWebhook = async (message: string, sessionId: string, userName: string = 'Portfolio Visitor') => {
  const payload = {
    message,
    timestamp: new Date().toISOString(),
    sessionId,
    userName
  };

  // Determine webhook URL based on environment
  const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development' || import.meta.env.DEV;
  const baseWebhookUrl = isDevelopment 
    ? 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook-test/b653569b-761b-40ad-870e-1cc3c12e8bd2'
    : 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook/b653569b-761b-40ad-870e-1cc3c12e8bd2';

  // Use api.allorigins.win CORS proxy which doesn't require demo access
  const corsProxy = 'https://api.allorigins.win/raw?url=';
  const proxiedUrl = corsProxy + encodeURIComponent(baseWebhookUrl);

  console.log('🚀 Sending message to Galyarder AI interface...');
  console.log('Environment:', isDevelopment ? 'development' : 'production');
  console.log('Base webhook URL:', baseWebhookUrl);
  console.log('Proxied URL:', proxiedUrl);
  console.log('📤 Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(proxiedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Webhook success response:', result);
    
    // Extract AI response from n8n result
    const aiResponse = result.response || result.message || result.output || result.data?.response;
    
    if (aiResponse && typeof aiResponse === 'string') {
      console.log('🤖 Galyarder AI response:', aiResponse);
      return aiResponse;
    } else {
      console.warn('⚠️ No valid AI response found in webhook result:', result);
      return result.message || result.output || 'Response received from Galyarder AI interface';
    }

  } catch (error) {
    console.error('❌ Failed to connect to Galyarder AI interface:', error);
    
    // Enhanced error handling for CORS and network issues
    let errorMessage = 'Connection failed';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Network error - please check your connection and try again';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

const ProactiveAIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'unknown' | 'working' | 'failed'>('unknown');
  const [lastWebhookError, setLastWebhookError] = useState<string>('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversation, setConversation] = useState<ConversationState>({
    messages: [],
    isTyping: false,
    showSuggestions: false
  });

  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Use the proactive AI trigger hook
  const { currentMessage, clearCurrentMessage } = useProactiveAITrigger();

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('galyarder_ai_conversation');
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation);
        setConversation({
          messages: parsed.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          isTyping: false,
          showSuggestions: parsed.messages.length === 0
        });
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    }
  }, []);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (conversation.messages.length > 0) {
      localStorage.setItem('galyarder_ai_conversation', JSON.stringify({
        messages: conversation.messages,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [conversation.messages]);

  // Initialize position based on screen size
  useEffect(() => {
    const updatePosition = () => {
      const isMobile = window.innerWidth < 640;
      const padding = isMobile ? 16 : 32;
      
      setPosition({
        x: window.innerWidth - (isMobile ? 80 : 96) - padding,
        y: window.innerHeight - (isMobile ? 80 : 96) - padding
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Handle proactive messages
  useEffect(() => {
    if (currentMessage && !isOpen) {
      setIsOpen(true);
      addMessage('assistant', currentMessage.content);
      clearCurrentMessage();
    }
  }, [currentMessage, isOpen]);

  // Only trigger proactively if no conversation exists
  useEffect(() => {
    if (conversation.messages.length > 0) return; // Don't trigger if conversation exists

    let inactivityTimer: NodeJS.Timeout;
    let exitIntentListener: (e: MouseEvent) => void;

    const triggerProactively = () => {
      if (!isOpen && conversation.messages.length === 0) {
        setIsOpen(true);
        addMessage('assistant', "I am the digital interface for Galyarder. I have access to his project data, architectural principles, and availability. How can I assist?");
      }
    };

    // Trigger after 15 seconds of inactivity
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(triggerProactively, 15000);
    };

    // Trigger on exit intent (desktop only)
    exitIntentListener = (e: MouseEvent) => {
      if (e.clientY <= 0 && window.innerWidth >= 640) {
        triggerProactively();
      }
    };

    // Set up listeners
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    document.addEventListener('mouseleave', exitIntentListener);

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keypress', resetInactivityTimer);
      document.removeEventListener('scroll', resetInactivityTimer);
      document.removeEventListener('mouseleave', exitIntentListener);
    };
  }, [isOpen, conversation.messages.length]);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      showSuggestions: type === 'assistant' && prev.messages.length === 0 // Only show suggestions for first assistant message
    }));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    
    setConversation(prev => ({ ...prev, isTyping: true, showSuggestions: false }));

    try {
      const aiResponse = await sendMessageToWebhook(userMessage, sessionId);
      setWebhookStatus('working');
      setLastWebhookError('');
      addMessage('assistant', aiResponse);
    } catch (error) {
      console.error('❌ Failed to connect to Galyarder AI interface:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setWebhookStatus('failed');
      setLastWebhookError(errorMessage);
      
      // Show error message instead of fallback
      addMessage('system', `Unable to connect to Galyarder's AI interface: ${errorMessage}. Please try again or contact directly via the methods in the Contact page.`);
    } finally {
      setConversation(prev => ({ ...prev, isTyping: false }));
    }
  };

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

  // Clear conversation function
  const clearConversation = () => {
    setConversation({
      messages: [],
      isTyping: false,
      showSuggestions: true
    });
    setWebhookStatus('unknown'); // Reset webhook status
    setLastWebhookError(''); // Clear error message
    localStorage.removeItem('galyarder_ai_conversation');
  };

  // Get status display info
  const getStatusInfo = () => {
    switch (webhookStatus) {
      case 'working':
        return {
          icon: Wifi,
          color: 'text-green-400',
          title: 'Connected to Galyarder AI interface'
        };
      case 'failed':
        return {
          icon: WifiOff,
          color: 'text-red-400',
          title: `AI interface unavailable${lastWebhookError ? `: ${lastWebhookError}` : ''}`
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-blue-400',
          title: 'Connecting to Galyarder AI interface...'
        };
    }
  };

  const statusInfo = getStatusInfo();

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
              bottom: window.innerWidth < 640 ? '1rem' : '2rem',
              right: window.innerWidth < 640 ? '1rem' : '2rem',
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
                  <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Galyarder AI Interface</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-400 truncate">Digital Interface & Project Assistant</p>
                    <div className="flex items-center" title={statusInfo.title}>
                      <statusInfo.icon className={`w-3 h-3 ${statusInfo.color}`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {conversation.messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded text-xs"
                    title="Clear conversation"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50 flex-shrink-0 touch-manipulation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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
                        : message.type === 'system'
                        ? 'bg-red-500/20 text-red-200 border border-red-500/30 shadow-md'
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
                      <Loader className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400 animate-spin" />
                      <span className="text-gray-400 text-xs">
                        Galyarder is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Suggestions - Only show for first interaction */}
              {conversation.showSuggestions && conversation.messages.length === 1 && (
                <div className="space-y-2 sm:space-y-3 pt-2">
                  <p className="text-xs text-gray-400 flex items-center font-medium">
                    <Terminal className="w-3 h-3 mr-2" />
                    Suggested topics:
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
                  placeholder="Ask Galyarder about projects, architecture, or availability..."
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProactiveAIConcierge;