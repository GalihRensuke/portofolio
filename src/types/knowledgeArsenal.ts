// Knowledge Arsenal Type Definitions
// Central type system for the knowledge management infrastructure

export enum KnowledgeType {
  PROJECT_CASE_STUDY = 'project_case_study',
  ARCHITECTURAL_PRINCIPLE = 'architectural_principle',
  INSIGHT = 'insight',
  TESTIMONIAL = 'testimonial',
  TECHNOLOGY = 'technology',
  MISSION_LOG = 'mission_log',
  CODE_EXAMPLE = 'code_example',
  RESEARCH_NOTE = 'research_note',
  CLIENT_INTERACTION = 'client_interaction',
  LEARNING_RESOURCE = 'learning_resource'
}

export enum RelationshipType {
  IMPLEMENTS = 'implements',
  EXTENDS = 'extends',
  CONTRADICTS = 'contradicts',
  SUPPORTS = 'supports',
  REFERENCES = 'references',
  SUPERSEDES = 'supersedes',
  APPLIES_TO = 'applies_to',
  DERIVED_FROM = 'derived_from',
  VALIDATES = 'validates'
}

export enum AccessLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential'
}

export interface KnowledgeMetadata {
  source: string;
  author: string;
  tags: string[];
  category: string;
  subcategory?: string;
  confidence_score: number; // 0-1 scale
  relevance_score: number; // 0-1 scale
  access_level: AccessLevel;
  project_associations: string[];
  client_associations: string[];
  technology_stack: string[];
  business_impact?: {
    roi_improvement?: string;
    efficiency_gain?: string;
    time_saved?: string;
    cost_reduction?: string;
  };
  verification_status: 'verified' | 'calculated' | 'estimated' | 'unverified';
  last_validated: string;
}

export interface KnowledgeRelationship {
  target_id: string;
  relationship_type: RelationshipType;
  strength: number; // 0-1 scale
  context?: string;
  bidirectional: boolean;
  created_at: string;
  validated: boolean;
}

export interface KnowledgeEmbeddings {
  content_embedding: number[];
  summary_embedding: number[];
  title_embedding: number[];
  embedding_model: string;
  embedding_version: string;
  created_at: string;
}

export interface KnowledgeEntity {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  summary: string;
  metadata: KnowledgeMetadata;
  relationships: KnowledgeRelationship[];
  embeddings: KnowledgeEmbeddings;
  created_at: string;
  updated_at: string;
  version: number;
  checksum: string; // For change detection
}

// Specialized entity types
export interface ProjectKnowledgeEntity extends KnowledgeEntity {
  type: KnowledgeType.PROJECT_CASE_STUDY;
  project_data: {
    status: 'production' | 'development' | 'research' | 'archived';
    tech_stack: string[];
    metrics: Record<string, string>;
    architecture_patterns: string[];
    lessons_learned: string[];
    client_feedback: string[];
    deployment_date?: string;
    team_size?: number;
    duration_months?: number;
  };
}

export interface ArchitecturalKnowledgeEntity extends KnowledgeEntity {
  type: KnowledgeType.ARCHITECTURAL_PRINCIPLE;
  principle_data: {
    category: 'core' | 'architecture' | 'mental' | 'implementation' | 'security';
    implementation_examples: string[];
    anti_patterns: string[];
    decision_criteria: string[];
    trade_offs: string[];
    maturity_level: 'experimental' | 'proven' | 'standard' | 'deprecated';
  };
}

export interface CodeKnowledgeEntity extends KnowledgeEntity {
  type: KnowledgeType.CODE_EXAMPLE;
  code_data: {
    language: string;
    framework?: string;
    complexity_level: 'beginner' | 'intermediate' | 'advanced';
    code_snippet: string;
    explanation: string;
    use_cases: string[];
    dependencies: string[];
    performance_notes?: string;
    security_considerations?: string[];
  };
}

export interface InsightKnowledgeEntity extends KnowledgeEntity {
  type: KnowledgeType.INSIGHT;
  insight_data: {
    category: 'principle' | 'observation' | 'methodology' | 'philosophy';
    context_keywords: string[];
    application_domains: string[];
    supporting_evidence: string[];
    counter_examples?: string[];
  };
}

// Search and query interfaces
export interface SemanticSearchQuery {
  query: string;
  filters?: {
    types?: KnowledgeType[];
    categories?: string[];
    tags?: string[];
    access_levels?: AccessLevel[];
    date_range?: {
      start: string;
      end: string;
    };
    project_associations?: string[];
    technology_stack?: string[];
  };
  similarity_threshold?: number;
  max_results?: number;
  include_relationships?: boolean;
}

export interface SearchResult {
  entity: KnowledgeEntity;
  similarity_score: number;
  relevance_explanation: string;
  related_entities: KnowledgeEntity[];
  highlighted_content: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeEntity[];
  edges: KnowledgeRelationship[];
  clusters: {
    id: string;
    name: string;
    entities: string[];
    strength: number;
  }[];
}

// Pipeline and processing interfaces
export interface IngestionJob {
  id: string;
  source: string;
  source_type: 'file' | 'api' | 'database' | 'webhook';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  entities_processed: number;
  entities_created: number;
  entities_updated: number;
  errors: string[];
  started_at: string;
  completed_at?: string;
  metadata: Record<string, any>;
}

export interface ContentProcessor {
  name: string;
  version: string;
  process: (content: string, metadata: Partial<KnowledgeMetadata>) => Promise<Partial<KnowledgeEntity>>;
  validate: (entity: Partial<KnowledgeEntity>) => boolean;
}

export interface EmbeddingProvider {
  name: string;
  model: string;
  dimensions: number;
  generateEmbedding: (text: string) => Promise<number[]>;
  batchGenerateEmbeddings: (texts: string[]) => Promise<number[][]>;
}

// Analytics and insights
export interface KnowledgeAnalytics {
  total_entities: number;
  entities_by_type: Record<KnowledgeType, number>;
  entities_by_category: Record<string, number>;
  relationship_density: number;
  average_relationships_per_entity: number;
  most_connected_entities: {
    entity_id: string;
    title: string;
    connection_count: number;
  }[];
  knowledge_gaps: {
    category: string;
    missing_connections: number;
    suggested_content: string[];
  }[];
  update_frequency: Record<string, number>;
  search_patterns: {
    popular_queries: string[];
    common_filters: Record<string, number>;
    result_satisfaction: number;
  };
}

export interface KnowledgeRecommendation {
  type: 'related_content' | 'knowledge_gap' | 'update_suggestion' | 'quality_improvement';
  entity_id?: string;
  title: string;
  description: string;
  confidence: number;
  action_required: boolean;
  suggested_actions: string[];
  created_at: string;
}