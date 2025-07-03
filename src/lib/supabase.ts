import { createClient } from '@supabase/supabase-js';

// Using environment variables or fallback to demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create client with error handling for demo mode
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // Disable auth persistence for demo mode
  }
});

export type MissionLog = {
  id: string;
  timestamp: string;
  log_entry: string;
  status: 'active' | 'completed' | 'planning';
  project_tag?: string;
};

export type ProjectMetrics = {
  id: string;
  project_name: string;
  objective: string;
  system_architecture: string;
  outcome: string;
  metrics: {
    efficiency_gain?: string;
    roi?: string;
    transactions_processed?: string;
    time_saved?: string;
  };
  tech_stack: string[];
  visual_flow?: string;
  status: 'production' | 'development' | 'research' | 'archived';
};

// Demo mode check
export const isDemoMode = () => {
  return supabaseUrl === 'https://demo.supabase.co' || supabaseKey === 'demo-key';
};