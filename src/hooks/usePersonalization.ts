import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type Persona = 'founder' | 'developer' | 'investor' | 'default';

export interface PersonalizationData {
  persona: Persona;
  campaign: string | null;
  source: string | null;
  primaryCTA: {
    text: string;
    description: string;
    href: string;
    icon: string;
  };
  secondaryCTA: {
    text: string;
    description: string;
    href: string;
  };
}

const ctaMapping = {
  defi: {
    text: 'Analyze DeFi Strategy',
    description: 'Deep-dive into Web3 architecture patterns and DeFi protocol optimization',
    href: '/projects#airdropops',
    icon: 'Coins'
  },
  ai_agent: {
    text: 'Deploy AI Agent',
    description: 'Experience structured AI engineering with the Prompt Codex system',
    href: '/sandbox',
    icon: 'Brain'
  },
  automation: {
    text: 'Automate Workflows',
    description: 'See how n8n orchestration eliminates manual operations',
    href: '/projects#galyarderos',
    icon: 'Zap'
  },
  architecture: {
    text: 'Explore Architecture',
    description: 'Interactive system blueprints and design patterns',
    href: '/blueprint',
    icon: 'GitBranch'
  },
  default: {
    text: 'Live Fire Sandbox',
    description: 'Experience the Prompt Codex system in action',
    href: '/sandbox',
    icon: 'Zap'
  }
};

const personaMapping = {
  founder: {
    primarySort: 'roi',
    showMetrics: true,
    emphasizeTechnical: false
  },
  developer: {
    primarySort: 'technical',
    showMetrics: false,
    emphasizeTechnical: true
  },
  investor: {
    primarySort: 'scalability',
    showMetrics: true,
    emphasizeTechnical: false
  },
  default: {
    primarySort: 'balanced',
    showMetrics: true,
    emphasizeTechnical: true
  }
};

export const usePersonalization = (): PersonalizationData => {
  const [searchParams] = useSearchParams();
  const [persona, setPersona] = useState<Persona>('default');

  useEffect(() => {
    // Extract UTM parameters
    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmMedium = searchParams.get('utm_medium');

    // Infer persona from UTM parameters
    if (utmSource === 'linkedin' && utmMedium === 'social') {
      setPersona('founder');
    } else if (utmSource === 'github' || utmCampaign?.includes('dev')) {
      setPersona('developer');
    } else if (utmCampaign?.includes('investor') || utmSource === 'angellist') {
      setPersona('investor');
    }

    // Store in localStorage for persistence
    if (persona !== 'default') {
      localStorage.setItem('galyarder_persona', persona);
    }
  }, [searchParams, persona]);

  // Load persisted persona
  useEffect(() => {
    const stored = localStorage.getItem('galyarder_persona') as Persona;
    if (stored && stored !== 'default') {
      setPersona(stored);
    }
  }, []);

  const campaign = searchParams.get('utm_campaign');
  const source = searchParams.get('utm_source');

  // Determine primary CTA based on campaign
  let primaryCTA = ctaMapping.default;
  if (campaign) {
    for (const [key, cta] of Object.entries(ctaMapping)) {
      if (campaign.includes(key) && key !== 'default') {
        primaryCTA = cta;
        break;
      }
    }
  }

  const secondaryCTA = {
    text: 'Autonomous Intake',
    description: 'Intelligent client qualification system',
    href: '/contact'
  };

  return {
    persona,
    campaign,
    source,
    primaryCTA,
    secondaryCTA
  };
};

export const usePersonaPreferences = (persona: Persona) => {
  return personaMapping[persona] || personaMapping.default;
};