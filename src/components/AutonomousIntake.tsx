import React, { useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useIntakeStore } from '../store/intakeStore';
import { ArrowRight, ArrowLeft, CheckCircle, Zap, Clock, DollarSign, Target, Calendar, ExternalLink, Rocket } from 'lucide-react';

const AutonomousIntake = () => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [validatedFields, setValidatedFields] = React.useState<Set<string>>(new Set());

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

  // Enhanced input component with holographic effects
  const HolographicInput = ({ 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    label,
    fieldId,
    required = false,
    rows 
  }: {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    label: string;
    fieldId: string;
    required?: boolean;
    rows?: number;
  }) => {
    const isFocused = focusedField === fieldId;
    const isValid = validatedFields.has(fieldId);
    const hasValue = value.length > 0;
    
    const borderGlow = useMotionValue(0);
    const labelY = useTransform(borderGlow, [0, 1], [0, -25]);
    const labelScale = useTransform(borderGlow, [0, 1], [1, 0.85]);
    
    React.useEffect(() => {
      borderGlow.set(isFocused || hasValue ? 1 : 0);
    }, [isFocused, hasValue, borderGlow]);
    
    const handleFocus = () => {
      setFocusedField(fieldId);
    };
    
    const handleBlur = () => {
      setFocusedField(null);
      if (required && value.trim()) {
        setValidatedFields(prev => new Set([...prev, fieldId]));
        // Play validation sound effect (mock)
        console.log('✓ Field validated:', fieldId);
      }
    };
    
    const InputComponent = rows ? 'textarea' : 'input';
    
    return (
      <div className="relative">
        <motion.label
          className={`absolute left-4 pointer-events-none transition-colors duration-200 font-medium ${
            isFocused ? 'text-indigo-400' : hasValue ? 'text-gray-300' : 'text-gray-500'
          }`}
          style={{
            y: labelY,
            scale: labelScale,
            transformOrigin: 'left center',
            top: hasValue || isFocused ? '0px' : '12px',
          }}
          animate={{
            color: isFocused ? '#6366f1' : hasValue ? '#d1d5db' : '#6b7280'
          }}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </motion.label>
        
        <motion.div
          className="relative"
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <InputComponent
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            rows={rows}
            className={`w-full px-4 py-3 pt-6 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
              rows ? 'resize-none' : ''
            }`}
            style={{
              border: '2px solid transparent',
              backgroundImage: isFocused 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)), linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)'
                : 'linear-gradient(135deg, rgba(75, 85, 99, 0.5), rgba(55, 65, 81, 0.5))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: isFocused 
                ? '0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          />
          
          {/* Animated border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              background: isFocused
                ? 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent)'
                : 'transparent',
              backgroundSize: isFocused ? '200% 100%' : '100% 100%',
              backgroundPosition: isFocused ? ['0% 0%', '200% 0%'] : '0% 0%',
            }}
            transition={{
              background: { duration: 0.3 },
              backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
            }}
            style={{
              maskImage: 'linear-gradient(to right, transparent 1px, black 1px, black calc(100% - 1px), transparent calc(100% - 1px)), linear-gradient(to bottom, transparent 1px, black 1px, black calc(100% - 1px), transparent calc(100% - 1px))',
              maskComposite: 'intersect',
            }}
          />
          
          {/* Validation checkmark */}
          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative overflow-hidden ${
                stepNum <= step 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}
              animate={{
                scale: stepNum === step ? [1, 1.1, 1] : 1,
                boxShadow: stepNum === step 
                  ? '0 0 20px rgba(99, 102, 241, 0.5)'
                  : '0 0 0px rgba(99, 102, 241, 0)',
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                boxShadow: { duration: 0.3 }
              }}
            >
              {stepNum <= step && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
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
                className={`w-12 h-0.5 relative overflow-hidden ${
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What brings you here?</h2>
              <p className="text-gray-400">Select your primary intent</p>
            </div>

            <div className="grid gap-4">
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
                <button
                  key={option.value}
                  onClick={() => setIntent(option.value as any)}
                  className={`p-6 text-left border rounded-lg transition-all ${
                    intent === option.value
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : option.highlight
                      ? 'border-indigo-400/50 hover:border-indigo-400 bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <option.icon className={`h-6 w-6 mt-1 ${
                      intent === option.value 
                        ? 'text-indigo-400' 
                        : option.highlight 
                        ? 'text-indigo-400' 
                        : 'text-gray-400'
                    }`} />
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
                </button>
              ))}
            </div>
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
              <HolographicInput
                placeholder="Describe your challenge, current pain points, and desired outcomes. What would massive ROI look like for your organization?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                label="Challenge Description (Recommended for flagship projects)"
                fieldId="projectDescription"
                rows={4}
              />
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
                <HolographicInput
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ name: e.target.value })}
                  placeholder="Your name"
                  label="Name"
                  fieldId="name"
                  required
                />
              </div>

              <div>
                <HolographicInput
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  placeholder="your@email.com"
                  label="Email"
                  fieldId="email"
                  required
                />
              </div>

              <div>
                <HolographicInput
                  type="text"
                  value={contactInfo.company}
                  onChange={(e) => setContactInfo({ company: e.target.value })}
                  placeholder="Company name"
                  label="Company (Optional)"
                  fieldId="company"
                />
              </div>
            </div>

            {/* Real-time Lead Scoring Display */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Lead Score</span>
                <span className="text-lg font-bold text-indigo-400">{calculateDisplayScore()}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateDisplayScore()}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Priority: {getPriorityLabel()}</span>
                <span>Response: {getResponseTime()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between items-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <motion.button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: canProceed() && !isSubmitting
              ? '0 0 20px rgba(99, 102, 241, 0.4)'
              : '0 0 0px rgba(99, 102, 241, 0)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
            animate={{
              x: canProceed() && !isSubmitting ? ['-100%', '100%'] : '0%',
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            }}
          />
          <span className="relative z-10">
          {isSubmitting ? (
            'Processing...'
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
    </div>
  );
};

export default AutonomousIntake;