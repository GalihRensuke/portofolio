import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface KnowledgeUpdate {
  id: string;
  timestamp: string;
  type: 'project' | 'insight' | 'principle' | 'metric';
  content: string;
  status: 'processing' | 'indexed' | 'failed';
  source: string;
}

interface PipelineStatus {
  lastUpdate: string;
  totalEntries: number;
  pendingUpdates: number;
  indexingRate: number;
  systemHealth: 'healthy' | 'degraded' | 'error';
}

const KnowledgePipeline = () => {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<KnowledgeUpdate[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchPipelineStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPipelineStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPipelineStatus = async () => {
    const apiUrl = import.meta.env.VITE_KNOWLEDGE_PIPELINE_API_URL;
    
    // If no API URL is configured, use mock data directly
    if (!apiUrl) {
      loadMockData();
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pipeline status');
      }
      
      const data = await response.json();
      setPipelineStatus(data.status);
      setRecentUpdates(data.recentUpdates);
    } catch (error) {
      console.error('Failed to fetch pipeline status:', error);
      
      // Fallback to mock data
      loadMockData();
    }
  };

  const loadMockData = () => {
    setPipelineStatus({
      lastUpdate: new Date().toISOString(),
      totalEntries: 1247,
      pendingUpdates: 3,
      indexingRate: 98.5,
      systemHealth: 'healthy',
    });
    
    setRecentUpdates([
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: 'project',
        content: 'Updated AirdropOps metrics: 200% ROI improvement validated',
        status: 'indexed',
        source: 'project_metrics.json'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        type: 'insight',
        content: 'New architectural principle: Event-driven microservices pattern',
        status: 'indexed',
        source: 'daily_synthesis.md'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        type: 'principle',
        content: 'First principles thinking framework for system design',
        status: 'processing',
        source: 'mental_models.md'
      },
    ]);
  };

  const triggerManualUpdate = async () => {
    setIsUpdating(true);
    
    const apiUrl = import.meta.env.VITE_KNOWLEDGE_PIPELINE_API_URL;
    
    // If no API URL is configured, simulate update with mock data
    if (!apiUrl) {
      setTimeout(() => {
        loadMockData();
        setIsUpdating(false);
      }, 2000);
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual', timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger update');
      }
      
      // Refresh status after update
      setTimeout(fetchPipelineStatus, 2000);
    } catch (error) {
      console.error('Failed to trigger manual update:', error);
      // Fallback to mock data refresh
      setTimeout(() => {
        loadMockData();
      }, 2000);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-blue-400';
      case 'insight': return 'text-purple-400';
      case 'principle': return 'text-green-400';
      case 'metric': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!pipelineStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Knowledge Pipeline</h2>
          <p className="text-gray-400">Automated intelligence compounding system</p>
        </div>
        
        <button
          onClick={triggerManualUpdate}
          disabled={isUpdating}
          className="flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Manual Update
            </>
          )}
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Database className="h-6 w-6 text-blue-400" />
            <span className={`text-sm font-medium ${getHealthColor(pipelineStatus.systemHealth)}`}>
              {pipelineStatus.systemHealth}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{pipelineStatus.totalEntries}</div>
          <div className="text-sm text-gray-400">Total Knowledge Entries</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-6 w-6 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">pending</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{pipelineStatus.pendingUpdates}</div>
          <div className="text-sm text-gray-400">Pending Updates</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-6 w-6 text-green-400" />
            <span className="text-sm font-medium text-green-400">+2.3%</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{pipelineStatus.indexingRate}%</div>
          <div className="text-sm text-gray-400">Indexing Success Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="h-6 w-6 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">live</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {new Date(pipelineStatus.lastUpdate).toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-400">Last Update</div>
        </motion.div>
      </div>

      {/* Recent Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-400" />
          Recent Knowledge Updates
        </h3>
        
        <div className="space-y-4">
          {recentUpdates.map((update) => (
            <div key={update.id} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(update.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-medium capitalize ${getTypeColor(update.type)}`}>
                    {update.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-2">{update.content}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Source: {update.source}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    update.status === 'indexed' ? 'bg-green-500/20 text-green-400' :
                    update.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {update.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pipeline Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Pipeline Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Automated Sources</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Daily synthesis notes</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Project metrics updates</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Architecture principles</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Client interaction logs</span>
                <span className="text-green-400">✓ Active</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Update Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Daily synthesis</span>
                <span className="text-blue-400">16:00 UTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Metrics refresh</span>
                <span className="text-blue-400">Every 6 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Vector reindexing</span>
                <span className="text-blue-400">Weekly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Backup & validation</span>
                <span className="text-blue-400">Daily</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgePipeline;