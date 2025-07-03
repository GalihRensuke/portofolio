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
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNum <= step 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-0.5 ${
                stepNum < step ? 'bg-indigo-500' : 'bg-gray-700'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Challenge Description (Recommended for flagship projects)
              </label>
              <textarea
                placeholder="Describe your challenge, current pain points, and desired outcomes. What would massive ROI look like for your organization?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none resize-none"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={contactInfo.company}
                  onChange={(e) => setContactInfo({ company: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                  placeholder="Company name"
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
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
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
        </button>
      </div>
    </div>
  );
};

export default AutonomousIntake;