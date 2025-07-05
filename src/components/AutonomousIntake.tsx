import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntakeStore } from '../store/intakeStore';
import { ArrowRight, ArrowLeft, CheckCircle, Zap, Clock, DollarSign, Target, Calendar, ExternalLink, Rocket } from 'lucide-react';

const AutonomousIntake = () => {
  const {
    step,
    intent,
    budget,
    timeline,
    domain,
    customDomain,
    projectDescription,
    contactInfo,
    isSubmitting,
    isComplete,
    calendlyUrl,
    setStep,
    setIntent,
    setBudget,
    setTimeline,
    setDomain,
    setCustomDomain,
    setProjectDescription,
    setContactInfo,
    submitIntake,
    reset,
  } = useIntakeStore();

  // Check for flagship intent parameter and auto-select project collaboration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('intent') === 'collaboration') {
      setIntent('project');
    }
  }, [setIntent]);

  const canProceed = () => {
    switch (step) {
      case 1: return intent !== null;
      case 2: return intent !== 'project' || (budget && timeline && domain);
      case 3: return contactInfo.name && contactInfo.email;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (step === 3) {
        submitIntake();
      } else if (step === 1 && intent !== 'project') {
        setStep(3); // Skip project scoping for non-project intents
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 3 && intent !== 'project') {
      setStep(1); // Skip back to intent for non-project flows
    } else {
      setStep(step - 1);
    }
  };

  if (isComplete) {
    const isFlagshipCandidate = budget === '15k_plus' && timeline === 'immediate' && ['defi', 'ai_ml', 'automation'].includes(domain || '');
    const isHighValue = budget === '15k_plus' && timeline === 'immediate';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center p-8 bg-gray-900 rounded-lg border border-green-500/20"
      >
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Intake Complete</h3>
        
        {isFlagshipCandidate ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Rocket className="h-5 w-5 text-indigo-400" />
                <p className="text-indigo-400 font-semibold">Flagship Partner Candidate Detected</p>
              </div>
              <p className="text-gray-300 text-sm">
                Your project aligns with the flagship mandate. You'll receive priority routing and 
                a direct Calendly link within 10 minutes.
              </p>
            </div>
            
            {calendlyUrl && (
              <motion.a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Flagship Discussion
                <ExternalLink className="h-4 w-4 ml-2" />
              </motion.a>
            )}
          </div>
        ) : isHighValue ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">High-Priority Lead Detected</p>
              <p className="text-gray-300 text-sm">
                Your inquiry has been fast-tracked. You'll receive a Calendly link within 15 minutes.
              </p>
            </div>
            
            {calendlyUrl && (
              <motion.a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Discovery Call
                <ExternalLink className="h-4 w-4 ml-2" />
              </motion.a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">
              Your inquiry has been processed and routed to the appropriate workflow. 
              Expect a response within 24-48 hours.
            </p>
            
            <div className="text-sm text-gray-400 space-y-1">
              <div>Lead Score: {calculateDisplayScore()}/100</div>
              <div>Priority: {getPriorityLabel()}</div>
              <div>Estimated Response: {getResponseTime()}</div>
            </div>
          </div>
        )}
        
        <button
          onClick={reset}
          className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  const calculateDisplayScore = () => {
    let score = 0;
    if (budget === '15k_plus') score += 40;
    else if (budget === '5k_15k') score += 25;
    else if (budget === 'under_5k') score += 10;
    
    if (timeline === 'immediate') score += 30;
    else if (timeline === '1_3_months') score += 20;
    else if (timeline === 'conceptual') score += 5;
    
    if (intent === 'project') score += 20;
    else if (intent === 'advisory') score += 15;
    else if (intent === 'inquiry') score += 5;
    
    if (['defi', 'ai_ml', 'automation'].includes(domain || '')) score += 10;
    
    // Flagship bonus
    const description = projectDescription.toLowerCase();
    if (description.includes('sales') || description.includes('knowledge') || description.includes('automation')) {
      score += 15;
    }
    
    return Math.min(score, 100);
  };

  const getPriorityLabel = () => {
    const score = calculateDisplayScore();
    const isFlagship = budget === '15k_plus' && timeline === 'immediate' && ['defi', 'ai_ml', 'automation'].includes(domain || '');
    
    if (isFlagship) return 'Flagship';
    if (score >= 80) return 'High';
    if (score >= 50) return 'Standard';
    return 'Low';
  };

  const getResponseTime = () => {
    const score = calculateDisplayScore();
    const isFlagship = budget === '15k_plus' && timeline === 'immediate' && ['defi', 'ai_ml', 'automation'].includes(domain || '');
    
    if (isFlagship) return '10 minutes';
    if (score >= 80) return '15 minutes';
    if (score >= 50) return '24 hours';
    return '48 hours';
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Holographic Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundImage: [
              'linear-gradient(90deg, transparent 98%, rgba(99, 102, 241, 0.5) 100%), linear-gradient(0deg, transparent 98%, rgba(99, 102, 241, 0.5) 100%)',
              'linear-gradient(90deg, transparent 98%, rgba(139, 92, 246, 0.5) 100%), linear-gradient(0deg, transparent 98%, rgba(139, 92, 246, 0.5) 100%)',
              'linear-gradient(90deg, transparent 98%, rgba(99, 102, 241, 0.5) 100%), linear-gradient(0deg, transparent 98%, rgba(99, 102, 241, 0.5) 100%)'
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            backgroundSize: '30px 30px',
          }}
        />
        
        {/* Scanning Line Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent h-1"
          animate={{
            y: ['-100%', '100vh'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium relative overflow-hidden ${
                stepNum <= step 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}
              animate={{
                scale: stepNum === step ? [1, 1.1, 1] : 1,
                boxShadow: stepNum === step 
                  ? '0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(99, 102, 241, 0.4)'
                  : '0 0 0px rgba(99, 102, 241, 0)',
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                boxShadow: { duration: 0.3 }
              }}
            >
              {/* Holographic Ring */}
              <motion.div
                className="absolute inset-0 border-2 border-indigo-400/50 rounded-full"
                animate={{ rotate: stepNum === step ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              {stepNum <= step && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                  }}
                />
              )}
              <span className="relative z-10">{stepNum}</span>
            </motion.div>
            {stepNum < 3 && (
              <motion.div
                className={`w-16 h-1 relative overflow-hidden rounded-full ${
                  stepNum < step ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
                animate={{
                  background: stepNum < step 
                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)'
                    : '#374151'
                }}
              >
                {stepNum < step && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
        {/* Step 1: Intent */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Holographic Panel Header */}
            <motion.div 
              className="text-center mb-8 relative p-6 rounded-lg border border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(99, 102, 241, 0.2)',
                  '0 0 40px rgba(99, 102, 241, 0.4)',
                  '0 0 20px rgba(99, 102, 241, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">What brings you here?</h2>
              <p className="text-gray-400">Select your primary intent</p>
              
              {/* Corner Indicators */}
              {[0, 1, 2, 3].map((corner) => (
                <motion.div
                  key={corner}
                  className={`absolute w-3 h-3 border-2 border-indigo-400 ${
                    corner === 0 ? 'top-2 left-2 border-r-0 border-b-0' :
                    corner === 1 ? 'top-2 right-2 border-l-0 border-b-0' :
                    corner === 2 ? 'bottom-2 left-2 border-r-0 border-t-0' :
                    'bottom-2 right-2 border-l-0 border-t-0'
                  }`}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: corner * 0.5
                  }}
                />
              ))}
            </motion.div>

            <motion.div 
              className="grid gap-4"
              style={{ perspective: '1000px' }}
            >
              {[
                { 
                  value: 'project', 
                  icon: Rocket,
                  title: 'Flagship Project Collaboration', 
                  desc: 'I have a complex challenge that could be the definitive case study for massive ROI',
                  highlight: true
                },
                { 
                  value: 'advisory', 
                  icon: Zap,
                  title: 'Technical Advisory', 
                  desc: 'I need strategic guidance on system design, technology choices, or architecture' 
                },
                { 
                  value: 'inquiry', 
                  icon: Clock,
                  title: 'General Inquiry', 
                  desc: 'I want to learn more about your work or explore potential collaboration' 
                },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setIntent(option.value as any)}
                  className={`p-6 text-left border rounded-lg transition-all relative overflow-hidden group ${
                    intent === option.value
                      ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                      : option.highlight
                      ? 'border-indigo-400/50 hover:border-indigo-400 bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 2,
                    z: 10
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: intent === option.value 
                      ? '0 0 30px rgba(99, 102, 241, 0.3)'
                      : '0 0 0px rgba(99, 102, 241, 0)'
                  }}
                >
                  {/* Holographic Sweep Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: intent === option.value ? '100%' : '-100%' }}
                    transition={{ duration: 1.5, repeat: intent === option.value ? Infinity : 0 }}
                  />
                  
                  <div className="flex items-start space-x-4">
                    <motion.div
                      animate={{ 
                        rotate: intent === option.value ? [0, 5, -5, 0] : 0,
                        scale: intent === option.value ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <option.icon className={`h-6 w-6 mt-1 ${
                      intent === option.value 
                        ? 'text-indigo-400' 
                        : option.highlight 
                        ? 'text-indigo-400' 
                        : 'text-gray-400'
                      }`} />
                    </motion.div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        option.highlight ? 'text-indigo-300' : 'text-white'
                      }`}>
                        {option.title}
                        {option.highlight && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                            PRIORITY
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">{option.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Project Scoping */}
        {step === 2 && intent === 'project' && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Flagship Project Scoping</h2>
              <p className="text-gray-400">Help us understand your challenge requirements</p>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                <DollarSign className="inline h-4 w-4 mr-2" />
                Budget Range
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'under_5k', label: '< $5K', desc: 'Small scope' },
                  { value: '5k_15k', label: '$5K - $15K', desc: 'Medium scope' },
                  { value: '15k_plus', label: '$15K+', desc: 'Flagship scope', highlight: true },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBudget(option.value as any)}
                    className={`p-4 text-center border rounded-lg transition-all ${
                      budget === option.value
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : option.highlight
                        ? 'border-indigo-400/50 hover:border-indigo-400 bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`font-semibold ${option.highlight ? 'text-indigo-300' : 'text-white'}`}>
                      {option.label}
                      {option.highlight && (
                        <div className="text-xs text-indigo-400 mt-1">FLAGSHIP</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                <Clock className="inline h-4 w-4 mr-2" />
                Timeline
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'immediate', label: 'Immediate', desc: 'Start ASAP', highlight: true },
                  { value: '1_3_months', label: '1-3 Months', desc: 'Planned start' },
                  { value: 'conceptual', label: 'Conceptual', desc: 'Exploring ideas' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeline(option.value as any)}
                    className={`p-4 text-center border rounded-lg transition-all ${
                      timeline === option.value
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : option.highlight
                        ? 'border-indigo-400/50 hover:border-indigo-400 bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`font-semibold ${option.highlight ? 'text-indigo-300' : 'text-white'}`}>
                      {option.label}
                      {option.highlight && (
                        <div className="text-xs text-indigo-400 mt-1">PRIORITY</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                <Target className="inline h-4 w-4 mr-2" />
                Challenge Archetype
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'automation', label: 'Operational Automation', highlight: true },
                  { value: 'ai_ml', label: 'Enterprise AI Brain', highlight: true },
                  { value: 'defi', label: 'Autonomous Sales Engine', highlight: true },
                  { value: 'other', label: 'Other Challenge' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDomain(option.value as any)}
                    className={`p-4 text-center border rounded-lg transition-all ${
                      domain === option.value
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : option.highlight
                        ? 'border-indigo-400/50 hover:border-indigo-400 bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`font-semibold ${option.highlight ? 'text-indigo-300' : 'text-white'}`}>
                      {option.label}
                      {option.highlight && (
                        <div className="text-xs text-indigo-400 mt-1">FLAGSHIP</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {domain === 'other' && (
                <input
                  type="text"
                  placeholder="Specify challenge type..."
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="mt-3 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                />
              )}
            </div>

            {/* Project Description */}
            <div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Challenge Description (Recommended for flagship projects)
                </label>
                <textarea
                placeholder="Describe your challenge, current pain points, and desired outcomes. What would massive ROI look like for your organization?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none resize-none focus:ring-2 focus:ring-indigo-500/20"
              />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
              <p className="text-gray-400">How should we reach you?</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ name: e.target.value })}
                  placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                </div>
              </div>

              <div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                </div>
              </div>

              <div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company (Optional)
                  </label>
                  <input
                  type="text"
                  value={contactInfo.company}
                  onChange={(e) => setContactInfo({ company: e.target.value })}
                  placeholder="Company name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                </div>
              </div>
            </div>

            {/* Real-time Lead Scoring Display */}
            <motion.div 
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg relative overflow-hidden"
              animate={{
                borderColor: [
                  'rgba(75, 85, 99, 1)',
                  'rgba(99, 102, 241, 0.5)',
                  'rgba(75, 85, 99, 1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Data Stream Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Lead Score</span>
                <motion.span 
                  className="text-lg font-bold text-indigo-400 font-mono"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(99, 102, 241, 0)',
                      '0 0 10px rgba(99, 102, 241, 0.8)',
                      '0 0 0px rgba(99, 102, 241, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {calculateDisplayScore()}/100
                </motion.span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full relative"
                  style={{ width: `${calculateDisplayScore()}%` }}
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(99, 102, 241, 0)',
                      '0 0 10px rgba(99, 102, 241, 0.6)',
                      '0 0 0px rgba(99, 102, 241, 0)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Priority: {getPriorityLabel()}</span>
                <span>Response: {getResponseTime()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between items-center mt-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative group"
          whileHover={{ scale: step === 1 ? 1 : 1.05 }}
          whileTap={{ scale: step === 1 ? 1 : 0.95 }}
        >
          {step !== 1 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          )}
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: canProceed() && !isSubmitting 
              ? [
                  '0 0 20px rgba(99, 102, 241, 0.4)',
                  '0 0 40px rgba(99, 102, 241, 0.6)',
                  '0 0 20px rgba(99, 102, 241, 0.4)'
                ]
              : '0 0 0px rgba(99, 102, 241, 0)',
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          {/* Holographic Button Effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: canProceed() && !isSubmitting ? ['-100%', '100%'] : '0%',
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          {/* Corner Brackets */}
          <motion.div
            className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-white/50"
            animate={{
              opacity: canProceed() && !isSubmitting ? [0.5, 1, 0.5] : 0.5,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-white/50"
            animate={{
              opacity: canProceed() && !isSubmitting ? [0.5, 1, 0.5] : 0.5,
            }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
          
          <span className="relative z-10">
          {isSubmitting ? (
            <>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Processing...
              </motion.span>
            </>
          ) : step === 3 ? (
            'Submit'
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AutonomousIntake;