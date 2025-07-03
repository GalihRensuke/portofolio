import { useState, useEffect } from 'react';
import { supabase, MissionLog, isDemoMode } from '../lib/supabase';

export const useMissionLog = () => {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestMission = async () => {
    try {
      setLoading(true);
      setError(null);

      // If in demo mode, return mock data
      if (isDemoMode()) {
        const mockMissions: MissionLog[] = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            log_entry: 'System initialization complete - All modules operational',
            status: 'active',
            project_tag: 'core_systems'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            log_entry: 'DeFi protocol analysis framework deployed',
            status: 'completed',
            project_tag: 'defi_analysis'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            log_entry: 'AI agent orchestration layer - Phase 2 planning',
            status: 'planning',
            project_tag: 'ai_orchestration'
          }
        ];
        
        setMissions(mockMissions);
        setLoading(false);
        return;
      }

      // Attempt real Supabase fetch
      const { data, error: supabaseError } = await supabase
        .from('mission_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (supabaseError) {
        throw supabaseError;
      }

      setMissions(data || []);
    } catch (err) {
      console.warn('Mission log fetch failed, using demo data:', err);
      setError('Using demo data - Supabase not configured');
      
      // Fallback to demo data
      const mockMissions: MissionLog[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          log_entry: 'System initialization complete - All modules operational',
          status: 'active',
          project_tag: 'core_systems'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          log_entry: 'DeFi protocol analysis framework deployed',
          status: 'completed',
          project_tag: 'defi_analysis'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          log_entry: 'AI agent orchestration layer - Phase 2 planning',
          status: 'planning',
          project_tag: 'ai_orchestration'
        }
      ];
      
      setMissions(mockMissions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMission();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLatestMission, 30000);
    return () => clearInterval(interval);
  }, []);

  return { missions, loading, error, refetch: fetchLatestMission };
};