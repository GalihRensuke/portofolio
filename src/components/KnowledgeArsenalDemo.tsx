import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Zap, 
  Search, 
  FileText, 
  Network, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Download
} from 'lucide-react';
import { knowledgeIngestionPipeline } from '../services/knowledgeArsenal/ingestionPipeline';
import { IngestionJob, KnowledgeEntity } from '../types/knowledgeArsenal';

interface LiveKnowledgeMetrics {
  total_entities: number;
  entities_by_type: Record<string, number>;
  relationships_detected: number;
}

const KnowledgeArsenalDemo = () => {
  const [ingestionJob, setIngestionJob] = useState<IngestionJob | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeEntity[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveKnowledgeMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Animated values for metrics
  const animatedTotalEntities = useSpring(0, { stiffness: 100, damping: 30 });
  const animatedRelationships = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const stored = localStorage.getItem('galyarder_knowledge_base');
    if (stored) {
      setKnowledgeBase(JSON.parse(stored));
    }
    
    fetchLiveMetrics();
  }, []);

  useEffect(() => {
    if (liveMetrics) {
      animatedTotalEntities.set(liveMetrics.total_entities);
      animatedRelationships.set(liveMetrics.relationships_detected);
    }
  }, [liveMetrics, animatedTotalEntities, animatedRelationships]);

  const fetchLiveMetrics = async () => {
    setLoadingMetrics(true);
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.warn("VITE_N8N_WEBHOOK_URL is not set. Using fallback data.");
      // Fallback to local knowledgeBase data if live fetch fails
      if (knowledgeBase) {
        setLiveMetrics({
          total_entities: knowledgeBase.metadata.total_entities,
          entities_by_type: knowledgeBase.metadata.entities_by_type,
          relationships_detected: knowledgeBase.entities.reduce((acc: number, entity: KnowledgeEntity) => 
            acc + entity.relationships.length, 0
          )
        });
      } else {
        // Default mock data
        setLiveMetrics({
          total_entities: 1247,
          entities_by_type: {
            'project_case_study': 3,
            'architectural_principle': 15,
            'insight': 18,
            'testimonial': 10
          },
          relationships_detected: 89
        });
      }
      setLoadingMetrics(false);
      return;
    }

    try {
      const response = await fetch(`${n8nWebhookUrl}/knowledge_base/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LiveKnowledgeMetrics = await response.json();
      setLiveMetrics(data);
    } catch (error) {
      console.error("Failed to fetch live knowledge metrics:", error);
      // Fallback to local knowledgeBase data if live fetch fails
      if (knowledgeBase) {
        setLiveMetrics({
          total_entities: knowledgeBase.metadata.total_entities,
          entities_by_type: knowledgeBase.metadata.entities_by_type,
          relationships_detected: knowledgeBase.entities.reduce((acc: number, entity: KnowledgeEntity) => 
            acc + entity.relationships.length, 0
          )
        });
      } else {
        // Default mock data
        setLiveMetrics({
          total_entities: 1247,
          entities_by_type: {
            'project_case_study': 3,
            'architectural_principle': 15,
            'insight': 18,
            'testimonial': 10
          },
          relationships_detected: 89
        });
      }
    } finally {
      setLoadingMetrics(false);
    }
  };

  const runIngestion = async () => {
    setIsRunning(true);
    try {
      const job = await knowledgeIngestionPipeline.ingestPortfolioData();
      setIngestionJob(job);
      
      // Reload knowledge base and live metrics after ingestion
      const stored = localStorage.getItem('galyarder_knowledge_base');
      if (stored) {
        setKnowledgeBase(JSON.parse(stored));
      }
      fetchLiveMetrics();
    } catch (error) {
      console.error('Ingestion failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const performSearch = () => {
    if (!knowledgeBase || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Simple text-based search for demo
    const results = knowledgeBase.entities.filter((entity: KnowledgeEntity) =>
      entity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.metadata.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ).slice(0, 5);

    setSearchResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'processing': return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const downloadKnowledgeBase = () => {
    if (!knowledgeBase) return;
    
    const dataStr = JSON.stringify(knowledgeBase, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'galyarder-knowledge-base.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Knowledge Arsenal Demo</h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Experience the knowledge ingestion pipeline in action. This system converts all portfolio data 
          into a unified, searchable knowledge base with semantic relationships and vector embeddings.
        </p>
      </div>

      {/* Ingestion Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-indigo-400" />
            <h3 className="text-xl font-semibold text-white">Data Ingestion Pipeline</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            {knowledgeBase && (
              <button
                onClick={downloadKnowledgeBase}
                className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
            
            <button
              onClick={runIngestion}
              disabled={isRunning}
              className="flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Ingestion
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ingestion Status */}
        {ingestionJob && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(ingestionJob.status)}
                <div>
                  <div className="font-medium text-white">
                    Ingestion Job: {ingestionJob.id}
                  </div>
                  <div className="text-sm text-gray-400">
                    Status: {ingestionJob.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {ingestionJob.entities_created} entities created
                </div>
                <div className="text-xs text-gray-400">
                  {ingestionJob.entities_processed} processed
                </div>
              </div>
            </div>

            {ingestionJob.errors.length > 0 && (
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Errors:</h4>
                <ul className="space-y-1">
                  {ingestionJob.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-300">• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Knowledge Base Overview - Now uses liveMetrics */}
      {loadingMetrics ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        liveMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-6 w-6 text-blue-400" />
              <motion.span className="text-2xl font-bold text-white">
                {Math.round(animatedTotalEntities.get())}
              </motion.span>
            </div>
            <div className="text-sm text-gray-400">Total Knowledge Entities</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Network className="h-6 w-6 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {Object.keys(liveMetrics.entities_by_type).length}
              </span>
            </div>
            <div className="text-sm text-gray-400">Entity Types</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-6 w-6 text-purple-400" />
              <motion.span className="text-2xl font-bold text-white">
                {Math.round(animatedRelationships.get())}
              </motion.span>
            </div>
            <div className="text-sm text-gray-400">Relationships Detected</div>
          </div>
        </motion.div>
        )
      )}

      {/* Entity Type Breakdown - Now uses liveMetrics */}
      {loadingMetrics ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        liveMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-indigo-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Entity Distribution</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(liveMetrics.entities_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 capitalize">
                  {type.replace(/_/g, ' ')}
                </span>
                <span className="text-indigo-400 font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </motion.div>
        )
      )}

      {/* Search Interface */}
      {knowledgeBase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Search className="h-6 w-6 text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Knowledge Search</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              placeholder="Search knowledge base..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={performSearch}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-300">Search Results:</h4>
              {searchResults.map((entity) => (
                <div key={entity.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                    <h5 className="font-medium text-white">{entity.title}</h5>
                    <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full whitespace-nowrap">
                      {entity.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {entity.summary}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-400">
                    <span>Tags: {entity.metadata.tags.slice(0, 3).join(', ')}</span>
                    <span>Relationships: {entity.relationships.length}</span>
                    <span>Confidence: {(entity.metadata.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No results found for "{searchQuery}"
            </div>
          )}
        </motion.div>
      )}

      {/* System Architecture Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">System Architecture</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-400 mb-3">Data Sources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Project case studies with metrics</li>
              <li>• Architectural principles and patterns</li>
              <li>• Galyarder insights and observations</li>
              <li>• Client testimonials and feedback</li>
              <li>• Technology stack documentation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-400 mb-3">Processing Pipeline</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Content extraction and normalization</li>
              <li>• Metadata enrichment and tagging</li>
              <li>• Vector embedding generation</li>
              <li>• Relationship detection and mapping</li>
              <li>• Quality validation and scoring</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgeArsenalDemo;