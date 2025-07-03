// Knowledge Arsenal Ingestion Pipeline
// Orchestrates the conversion of portfolio data into knowledge entities

import { 
  KnowledgeEntity, 
  IngestionJob, 
  KnowledgeType,
  ContentProcessor 
} from '../../types/knowledgeArsenal';
import { PortfolioDataMapper } from './dataMappers';
import { projectMetrics } from '../../data/projectMetrics';
import { blueprintData } from '../../data/blueprintData';
import { galyarderInsights } from '../../data/galyarderInsights';
import { testimonials } from '../../data/testimonials';

export class KnowledgeIngestionPipeline {
  private processors: Map<KnowledgeType, ContentProcessor> = new Map();
  private embeddingProvider: any; // Will be implemented with actual embedding service
  
  constructor() {
    this.initializeProcessors();
  }

  /**
   * Main ingestion method - processes all portfolio data sources
   */
  async ingestPortfolioData(): Promise<IngestionJob> {
    const job: IngestionJob = {
      id: `ingestion_${Date.now()}`,
      source: 'portfolio_data',
      source_type: 'database',
      status: 'processing',
      entities_processed: 0,
      entities_created: 0,
      entities_updated: 0,
      errors: [],
      started_at: new Date().toISOString(),
      metadata: {
        sources: ['projects', 'blueprint', 'insights', 'testimonials']
      }
    };

    try {
      console.log('🚀 Starting Knowledge Arsenal ingestion...');
      
      const allEntities: KnowledgeEntity[] = [];

      // Process project case studies
      console.log('📊 Processing project case studies...');
      const projectEntities = await this.processProjects();
      allEntities.push(...projectEntities);
      job.entities_processed += projectEntities.length;

      // Process architectural principles
      console.log('🏗️ Processing architectural principles...');
      const blueprintEntities = await this.processBlueprints();
      allEntities.push(...blueprintEntities);
      job.entities_processed += blueprintEntities.length;

      // Process insights
      console.log('💡 Processing Galyarder insights...');
      const insightEntities = await this.processInsights();
      allEntities.push(...insightEntities);
      job.entities_processed += insightEntities.length;

      // Process testimonials
      console.log('🗣️ Processing client testimonials...');
      const testimonialEntities = await this.processTestimonials();
      allEntities.push(...testimonialEntities);
      job.entities_processed += testimonialEntities.length;

      // Generate embeddings for all entities
      console.log('🧠 Generating embeddings...');
      await this.generateEmbeddings(allEntities);

      // Detect and create relationships
      console.log('🔗 Detecting relationships...');
      await this.detectRelationships(allEntities);

      // Store entities (in production, this would save to vector database)
      console.log('💾 Storing knowledge entities...');
      await this.storeEntities(allEntities);

      job.entities_created = allEntities.length;
      job.status = 'completed';
      job.completed_at = new Date().toISOString();

      console.log(`✅ Ingestion completed successfully!`);
      console.log(`📈 Statistics:`);
      console.log(`   - Total entities processed: ${job.entities_processed}`);
      console.log(`   - Entities created: ${job.entities_created}`);
      console.log(`   - Processing time: ${this.calculateProcessingTime(job)}`);

      return job;

    } catch (error) {
      console.error('❌ Ingestion failed:', error);
      job.status = 'failed';
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      job.completed_at = new Date().toISOString();
      return job;
    }
  }

  /**
   * Process project metrics into knowledge entities
   */
  private async processProjects(): Promise<KnowledgeEntity[]> {
    const entities: KnowledgeEntity[] = [];
    
    for (const project of projectMetrics) {
      try {
        const entity = PortfolioDataMapper.mapProjectToKnowledge(project);
        
        // Apply content processing
        const processor = this.processors.get(KnowledgeType.PROJECT_CASE_STUDY);
        if (processor) {
          const processedEntity = await processor.process(entity.content, entity.metadata);
          Object.assign(entity, processedEntity);
        }
        
        entities.push(entity);
        console.log(`   ✓ Processed project: ${project.project_name}`);
      } catch (error) {
        console.error(`   ❌ Failed to process project ${project.project_name}:`, error);
      }
    }
    
    return entities;
  }

  /**
   * Process blueprint data into knowledge entities
   */
  private async processBlueprints(): Promise<KnowledgeEntity[]> {
    const entities: KnowledgeEntity[] = [];
    
    for (const node of blueprintData) {
      try {
        const entity = PortfolioDataMapper.mapBlueprintToKnowledge(node);
        
        // Apply content processing
        const processor = this.processors.get(KnowledgeType.ARCHITECTURAL_PRINCIPLE);
        if (processor) {
          const processedEntity = await processor.process(entity.content, entity.metadata);
          Object.assign(entity, processedEntity);
        }
        
        entities.push(entity);
        console.log(`   ✓ Processed blueprint: ${node.label}`);
      } catch (error) {
        console.error(`   ❌ Failed to process blueprint ${node.label}:`, error);
      }
    }
    
    return entities;
  }

  /**
   * Process insights into knowledge entities
   */
  private async processInsights(): Promise<KnowledgeEntity[]> {
    const entities: KnowledgeEntity[] = [];
    
    for (let i = 0; i < galyarderInsights.length; i++) {
      try {
        const insight = galyarderInsights[i];
        const entity = PortfolioDataMapper.mapInsightToKnowledge(insight, i);
        
        // Apply content processing
        const processor = this.processors.get(KnowledgeType.INSIGHT);
        if (processor) {
          const processedEntity = await processor.process(entity.content, entity.metadata);
          Object.assign(entity, processedEntity);
        }
        
        entities.push(entity);
        console.log(`   ✓ Processed insight: ${entity.title}`);
      } catch (error) {
        console.error(`   ❌ Failed to process insight ${i}:`, error);
      }
    }
    
    return entities;
  }

  /**
   * Process testimonials into knowledge entities
   */
  private async processTestimonials(): Promise<KnowledgeEntity[]> {
    const entities: KnowledgeEntity[] = [];
    
    for (const testimonial of testimonials) {
      try {
        const entity = PortfolioDataMapper.mapTestimonialToKnowledge(testimonial);
        
        // Apply content processing
        const processor = this.processors.get(KnowledgeType.TESTIMONIAL);
        if (processor) {
          const processedEntity = await processor.process(entity.content, entity.metadata);
          Object.assign(entity, processedEntity);
        }
        
        entities.push(entity);
        console.log(`   ✓ Processed testimonial: ${testimonial.author} - ${testimonial.company}`);
      } catch (error) {
        console.error(`   ❌ Failed to process testimonial ${testimonial.id}:`, error);
      }
    }
    
    return entities;
  }

  /**
   * Generate embeddings for all entities
   */
  private async generateEmbeddings(entities: KnowledgeEntity[]): Promise<void> {
    for (const entity of entities) {
      try {
        // In production, this would use actual embedding service
        entity.embeddings = {
          content_embedding: this.mockEmbedding(entity.content),
          summary_embedding: this.mockEmbedding(entity.summary),
          title_embedding: this.mockEmbedding(entity.title),
          embedding_model: 'text-embedding-ada-002',
          embedding_version: '1.0',
          created_at: new Date().toISOString()
        };
        
        console.log(`   ✓ Generated embeddings for: ${entity.title}`);
      } catch (error) {
        console.error(`   ❌ Failed to generate embeddings for ${entity.title}:`, error);
      }
    }
  }

  /**
   * Detect relationships between entities
   */
  private async detectRelationships(entities: KnowledgeEntity[]): Promise<void> {
    console.log(`   🔍 Analyzing ${entities.length} entities for relationships...`);
    
    let relationshipsDetected = 0;
    
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i];
        const entity2 = entities[j];
        
        // Detect relationships based on various criteria
        const relationships = this.detectEntityRelationships(entity1, entity2);
        
        if (relationships.length > 0) {
          entity1.relationships.push(...relationships);
          relationshipsDetected += relationships.length;
        }
      }
    }
    
    console.log(`   ✓ Detected ${relationshipsDetected} relationships`);
  }

  /**
   * Detect relationships between two specific entities
   */
  private detectEntityRelationships(entity1: KnowledgeEntity, entity2: KnowledgeEntity): any[] {
    const relationships = [];
    
    // Check for project associations
    const commonProjects = entity1.metadata.project_associations.filter(
      proj => entity2.metadata.project_associations.includes(proj)
    );
    
    if (commonProjects.length > 0) {
      relationships.push({
        target_id: entity2.id,
        relationship_type: 'applies_to',
        strength: 0.7,
        context: `Both relate to projects: ${commonProjects.join(', ')}`,
        bidirectional: true,
        created_at: new Date().toISOString(),
        validated: false
      });
    }
    
    // Check for technology stack overlap
    const commonTech = entity1.metadata.technology_stack.filter(
      tech => entity2.metadata.technology_stack.includes(tech)
    );
    
    if (commonTech.length > 0) {
      relationships.push({
        target_id: entity2.id,
        relationship_type: 'references',
        strength: 0.5,
        context: `Shared technologies: ${commonTech.join(', ')}`,
        bidirectional: true,
        created_at: new Date().toISOString(),
        validated: false
      });
    }
    
    // Check for tag overlap
    const commonTags = entity1.metadata.tags.filter(
      tag => entity2.metadata.tags.includes(tag)
    );
    
    if (commonTags.length >= 2) {
      relationships.push({
        target_id: entity2.id,
        relationship_type: 'supports',
        strength: 0.4,
        context: `Shared concepts: ${commonTags.join(', ')}`,
        bidirectional: true,
        created_at: new Date().toISOString(),
        validated: false
      });
    }
    
    return relationships;
  }

  /**
   * Store entities in the knowledge base
   */
  private async storeEntities(entities: KnowledgeEntity[]): Promise<void> {
    // In production, this would save to vector database
    // For now, we'll store in localStorage for demonstration
    
    const knowledgeBase = {
      entities: entities,
      metadata: {
        total_entities: entities.length,
        entities_by_type: this.groupEntitiesByType(entities),
        last_updated: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    localStorage.setItem('galyarder_knowledge_base', JSON.stringify(knowledgeBase));
    console.log(`   ✓ Stored ${entities.length} entities in knowledge base`);
  }

  /**
   * Initialize content processors for different entity types
   */
  private initializeProcessors(): void {
    // Basic content processors - in production these would be more sophisticated
    this.processors.set(KnowledgeType.PROJECT_CASE_STUDY, {
      name: 'ProjectProcessor',
      version: '1.0',
      process: async (content, metadata) => {
        // Enhanced processing for project content
        return {
          content: this.enhanceProjectContent(content),
          metadata: { ...metadata, confidence_score: 1.0 }
        };
      },
      validate: (entity) => {
        return !!(entity.title && entity.content && entity.summary);
      }
    });

    this.processors.set(KnowledgeType.ARCHITECTURAL_PRINCIPLE, {
      name: 'ArchitectureProcessor',
      version: '1.0',
      process: async (content, metadata) => {
        return {
          content: this.enhanceArchitectureContent(content),
          metadata: { ...metadata, confidence_score: 0.95 }
        };
      },
      validate: (entity) => {
        return !!(entity.title && entity.content);
      }
    });

    this.processors.set(KnowledgeType.INSIGHT, {
      name: 'InsightProcessor',
      version: '1.0',
      process: async (content, metadata) => {
        return {
          content: this.enhanceInsightContent(content),
          metadata: { ...metadata, confidence_score: 0.9 }
        };
      },
      validate: (entity) => {
        return !!(entity.title && entity.content);
      }
    });

    this.processors.set(KnowledgeType.TESTIMONIAL, {
      name: 'TestimonialProcessor',
      version: '1.0',
      process: async (content, metadata) => {
        return {
          content: this.enhanceTestimonialContent(content),
          metadata: { ...metadata, confidence_score: 1.0 }
        };
      },
      validate: (entity) => {
        return !!(entity.title && entity.content);
      }
    });
  }

  // Content enhancement methods
  private enhanceProjectContent(content: string): string {
    // Add structured sections and metadata
    return content + '\n\n## Knowledge Context\nThis project demonstrates practical application of architectural principles and showcases measurable business outcomes.';
  }

  private enhanceArchitectureContent(content: string): string {
    return content + '\n\n## Application Context\nThis principle is applied across multiple projects and forms part of the core architectural methodology.';
  }

  private enhanceInsightContent(content: string): string {
    return content + '\n\n## Insight Context\nThis insight emerges from practical experience and systematic observation of system behavior patterns.';
  }

  private enhanceTestimonialContent(content: string): string {
    return content + '\n\n## Validation Context\nThis testimonial provides external validation of project outcomes and client satisfaction.';
  }

  // Utility methods
  private mockEmbedding(text: string): number[] {
    // Mock embedding generation - in production would use actual embedding service
    const hash = this.simpleHash(text);
    return Array.from({ length: 1536 }, (_, i) => (hash + i) % 1000 / 1000);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private groupEntitiesByType(entities: KnowledgeEntity[]): Record<string, number> {
    return entities.reduce((acc, entity) => {
      acc[entity.type] = (acc[entity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateProcessingTime(job: IngestionJob): string {
    if (!job.completed_at) return 'N/A';
    
    const start = new Date(job.started_at).getTime();
    const end = new Date(job.completed_at).getTime();
    const duration = end - start;
    
    return `${(duration / 1000).toFixed(2)} seconds`;
  }
}

// Export singleton instance
export const knowledgeIngestionPipeline = new KnowledgeIngestionPipeline();