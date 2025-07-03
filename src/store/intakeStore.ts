import { create } from 'zustand';
import { z } from 'zod';

export const IntentSchema = z.enum(['project', 'advisory', 'inquiry']);
export const BudgetSchema = z.enum(['under_5k', '5k_15k', '15k_plus']);
export const TimelineSchema = z.enum(['immediate', '1_3_months', 'conceptual']);
export const DomainSchema = z.enum(['defi', 'ai_ml', 'automation', 'other']);

export interface IntakeState {
  step: number;
  intent: z.infer<typeof IntentSchema> | null;
  budget: z.infer<typeof BudgetSchema> | null;
  timeline: z.infer<typeof TimelineSchema> | null;
  domain: z.infer<typeof DomainSchema> | null;
  customDomain: string;
  projectDescription: string;
  contactInfo: {
    name: string;
    email: string;
    company?: string;
  };
  isSubmitting: boolean;
  isComplete: boolean;
  calendlyUrl?: string;
}

interface IntakeActions {
  setStep: (step: number) => void;
  setIntent: (intent: z.infer<typeof IntentSchema>) => void;
  setBudget: (budget: z.infer<typeof BudgetSchema>) => void;
  setTimeline: (timeline: z.infer<typeof TimelineSchema>) => void;
  setDomain: (domain: z.infer<typeof DomainSchema>) => void;
  setCustomDomain: (domain: string) => void;
  setProjectDescription: (description: string) => void;
  setContactInfo: (info: Partial<IntakeState['contactInfo']>) => void;
  setSubmitting: (submitting: boolean) => void;
  setComplete: (complete: boolean) => void;
  setCalendlyUrl: (url: string) => void;
  reset: () => void;
  submitIntake: () => Promise<void>;
}

const initialState: IntakeState = {
  step: 1,
  intent: null,
  budget: null,
  timeline: null,
  domain: null,
  customDomain: '',
  projectDescription: '',
  contactInfo: {
    name: '',
    email: '',
    company: '',
  },
  isSubmitting: false,
  isComplete: false,
  calendlyUrl: undefined,
};

export const useIntakeStore = create<IntakeState & IntakeActions>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setIntent: (intent) => set({ intent }),
  setBudget: (budget) => set({ budget }),
  setTimeline: (timeline) => set({ timeline }),
  setDomain: (domain) => set({ domain }),
  setCustomDomain: (customDomain) => set({ customDomain }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),
  setContactInfo: (info) => set((state) => ({ 
    contactInfo: { ...state.contactInfo, ...info } 
  })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setComplete: (isComplete) => set({ isComplete }),
  setCalendlyUrl: (calendlyUrl) => set({ calendlyUrl }),
  reset: () => set(initialState),

  submitIntake: async () => {
    const state = get();
    set({ isSubmitting: true });

    // Check for URL parameters to pre-fill flagship intent
    const urlParams = new URLSearchParams(window.location.search);
    const flagshipIntent = urlParams.get('intent') === 'flagship';
    const archetypeParam = urlParams.get('archetype');
    const sourceParam = urlParams.get('source');

    // FLAGSHIP PARTNER PRIORITY SCORING - Enhanced for new mandate
    const isFlagshipCandidate = (
      flagshipIntent ||
      (state.budget === '15k_plus' && 
       state.timeline === 'immediate' &&
       ['defi', 'ai_ml', 'automation'].includes(state.domain || ''))
    );
    
    const isHighValue = state.budget === '15k_plus' && state.timeline === 'immediate';
    const isQualified = state.budget !== 'under_5k' || state.intent === 'advisory';
    
    // Prepare comprehensive payload for n8n webhook - SIMPLIFIED STRUCTURE
    const payload = {
      // Core intake data
      intent: state.intent,
      budget: state.budget,
      timeline: state.timeline,
      domain: state.domain === 'other' ? state.customDomain : state.domain,
      project_description: state.projectDescription,
      contact_info: state.contactInfo,
      
      // FLAGSHIP MANDATE METADATA - Enhanced
      flagship_candidate: isFlagshipCandidate,
      archetype_match: archetypeParam || determineArchetype(state),
      flagship_source: sourceParam || 'direct',
      
      // System metadata
      priority: isFlagshipCandidate ? 'flagship' : isHighValue ? 'high' : isQualified ? 'standard' : 'low',
      qualified: isQualified,
      timestamp: new Date().toISOString(),
      source: 'portfolio_v4_flagship_oracle',
      
      // Lead scoring
      lead_score: calculateLeadScore(state),
    };

    try {
      // Determine which webhook to use based on environment
      const isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';
      const webhookUrl = isProduction 
        ? (import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook/f2b9aa71-235b-49f4-80fb-f16cb2e63913')
        : (import.meta.env.VITE_N8N_TEST_WEBHOOK_URL || 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook-test/f2b9aa71-235b-49f4-80fb-f16cb2e63913');
      
      console.log(`Sending intake to ${isProduction ? 'production' : 'test'} n8n webhook:`, webhookUrl);
      console.log('Intake payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('n8n intake webhook response status:', response.status);
      console.log('n8n intake webhook response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('n8n intake webhook error response:', errorText);
        throw new Error(`n8n webhook failed: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('n8n intake webhook success response:', result);
      
      // Handle response from n8n workflow
      if (result.calendly_url) {
        set({ calendlyUrl: result.calendly_url });
      }

      // Backup webhook for redundancy
      try {
        const backupWebhook = import.meta.env.VITE_ZAPIER_BACKUP_WEBHOOK || 'https://hooks.zapier.com/hooks/catch/backup-intake/';
        await fetch(backupWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log('Backup webhook sent successfully');
      } catch (backupError) {
        console.warn('Backup webhook failed:', backupError);
      }

      // Analytics tracking with flagship context
      if (typeof gtag !== 'undefined') {
        gtag('event', 'flagship_intake_submission', {
          event_category: 'flagship_mandate',
          event_label: payload.priority,
          value: getLeadValue(state.budget),
          custom_parameters: {
            flagship_candidate: isFlagshipCandidate,
            archetype: payload.archetype_match,
            source: payload.flagship_source
          }
        });
      }

      set({ isComplete: true });
      
      // Auto-redirect flagship candidates to Calendly
      if (isFlagshipCandidate && result.calendly_url) {
        setTimeout(() => {
          window.open(result.calendly_url, '_blank');
        }, 1500);
      }

    } catch (error) {
      console.error('n8n intake submission failed:', error);
      
      // Fallback: Store locally and show manual contact
      localStorage.setItem('galyarder_failed_intake', JSON.stringify({
        ...payload,
        error: error instanceof Error ? error.message : 'Unknown error',
        retry_count: (JSON.parse(localStorage.getItem('galyarder_failed_intake') || '{}').retry_count || 0) + 1
      }));
      
      // Still mark as complete but with fallback message
      set({ isComplete: true });
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

// FLAGSHIP ARCHETYPE MATCHING - Enhanced function
function determineArchetype(state: IntakeState): string | null {
  const description = state.projectDescription.toLowerCase();
  const domain = state.domain;
  
  // Autonomous Sales Engine indicators
  if (description.includes('sales') || description.includes('lead') || 
      description.includes('qualification') || description.includes('funnel') ||
      description.includes('crm') || description.includes('conversion') ||
      description.includes('prospect')) {
    return 'autonomous_sales_engine';
  }
  
  // Enterprise AI Brain indicators
  if (description.includes('knowledge') || description.includes('search') ||
      description.includes('documentation') || description.includes('internal') ||
      description.includes('ai') || description.includes('intelligent') ||
      description.includes('information') || description.includes('data') ||
      domain === 'ai_ml') {
    return 'enterprise_ai_brain';
  }
  
  // Operational Automation Core indicators
  if (description.includes('automation') || description.includes('manual') ||
      description.includes('workflow') || description.includes('process') ||
      description.includes('repetitive') || description.includes('operational') ||
      domain === 'automation') {
    return 'operational_automation_core';
  }
  
  return null;
}

// Enhanced lead scoring with flagship weighting
function calculateLeadScore(state: IntakeState): number {
  let score = 0;
  
  // Budget scoring (0-40 points)
  switch (state.budget) {
    case '15k_plus': score += 40; break;
    case '5k_15k': score += 25; break;
    case 'under_5k': score += 10; break;
  }
  
  // Timeline urgency (0-30 points)
  switch (state.timeline) {
    case 'immediate': score += 30; break;
    case '1_3_months': score += 20; break;
    case 'conceptual': score += 5; break;
  }
  
  // Intent quality (0-20 points)
  switch (state.intent) {
    case 'project': score += 20; break;
    case 'advisory': score += 15; break;
    case 'inquiry': score += 5; break;
  }
  
  // Domain alignment with flagship archetypes (0-15 points)
  if (['defi', 'ai_ml', 'automation'].includes(state.domain || '')) {
    score += 15;
  } else if (state.customDomain) {
    score += 8;
  }
  
  // FLAGSHIP BONUS - Enhanced
  const archetype = determineArchetype(state);
  if (archetype) {
    score += 25; // Increased bonus for archetype alignment
  }
  
  // URL parameter bonus for AI Concierge referrals
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('source') === 'ai_concierge') {
    score += 10;
  }
  
  return Math.min(score, 100);
}

// Lead value estimation for analytics
function getLeadValue(budget: string | null): number {
  switch (budget) {
    case '15k_plus': return 25000;
    case '5k_15k': return 10000;
    case 'under_5k': return 2500;
    default: return 0;
  }
}