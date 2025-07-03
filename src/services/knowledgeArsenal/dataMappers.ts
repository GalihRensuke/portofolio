// Data Mappers for Knowledge Arsenal
// Convert existing portfolio data to KnowledgeEntity format

import { 
  KnowledgeEntity, 
  KnowledgeType, 
  ProjectKnowledgeEntity, 
  ArchitecturalKnowledgeEntity,
  InsightKnowledgeEntity,
  AccessLevel,
  RelationshipType
} from '../../types/knowledgeArsenal';
import { ProjectMetrics } from '../../lib/supabase';
import { BlueprintNode } from '../../data/blueprintData';
import { GalyarderInsight } from '../../data/galyarderInsights';
import { Testimonial } from '../../data/testimonials';

export class PortfolioDataMapper {
  
  /**
   * Convert project metrics to knowledge entities
   */
  static mapProjectToKnowledge(project: ProjectMetrics): ProjectKnowledgeEntity {
    const baseEntity: KnowledgeEntity = {
      id: `project_${project.id}`,
      type: KnowledgeType.PROJECT_CASE_STUDY,
      title: project.project_name,
      content: this.generateProjectContent(project),
      summary: project.objective,
      metadata: {
        source: 'portfolio_projects',
        author: 'Galyarder',
        tags: this.generateProjectTags(project),
        category: 'project_case_study',
        subcategory: project.status,
        confidence_score: 1.0, // High confidence for own projects
        relevance_score: this.calculateProjectRelevance(project),
        access_level: AccessLevel.PUBLIC,
        project_associations: [project.id],
        client_associations: [], // To be populated from testimonials
        technology_stack: project.tech_stack,
        business_impact: {
          roi_improvement: project.metrics.roi,
          efficiency_gain: project.metrics.efficiency_gain,
          time_saved: project.metrics.time_saved
        },
        verification_status: 'verified',
        last_validated: new Date().toISOString()
      },
      relationships: [],
      embeddings: {
        content_embedding: [], // To be generated
        summary_embedding: [],
        title_embedding: [],
        embedding_model: 'text-embedding-ada-002',
        embedding_version: '1.0',
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      checksum: this.generateChecksum(project)
    };

    return {
      ...baseEntity,
      project_data: {
        status: project.status,
        tech_stack: project.tech_stack,
        metrics: project.metrics,
        architecture_patterns: this.extractArchitecturePatterns(project),
        lessons_learned: this.extractLessonsLearned(project),
        client_feedback: [], // To be populated from testimonials
        deployment_date: this.estimateDeploymentDate(project),
        team_size: 1, // Solo projects
        duration_months: this.estimateDuration(project)
      }
    };
  }

  /**
   * Convert blueprint nodes to architectural knowledge entities
   */
  static mapBlueprintToKnowledge(node: BlueprintNode): ArchitecturalKnowledgeEntity {
    const baseEntity: KnowledgeEntity = {
      id: `blueprint_${node.id}`,
      type: KnowledgeType.ARCHITECTURAL_PRINCIPLE,
      title: node.label,
      content: this.generateBlueprintContent(node),
      summary: node.description,
      metadata: {
        source: 'architectural_blueprint',
        author: 'Galyarder',
        tags: this.generateBlueprintTags(node),
        category: 'architectural_principle',
        subcategory: node.category,
        confidence_score: 0.95,
        relevance_score: this.calculateBlueprintRelevance(node),
        access_level: AccessLevel.PUBLIC,
        project_associations: this.findRelatedProjects(node),
        client_associations: [],
        technology_stack: this.inferTechnologyStack(node),
        verification_status: 'verified',
        last_validated: new Date().toISOString()
      },
      relationships: this.generateBlueprintRelationships(node),
      embeddings: {
        content_embedding: [],
        summary_embedding: [],
        title_embedding: [],
        embedding_model: 'text-embedding-ada-002',
        embedding_version: '1.0',
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      checksum: this.generateChecksum(node)
    };

    return {
      ...baseEntity,
      principle_data: {
        category: node.category,
        implementation_examples: node.examples || [],
        anti_patterns: this.generateAntiPatterns(node),
        decision_criteria: this.generateDecisionCriteria(node),
        trade_offs: this.generateTradeOffs(node),
        maturity_level: this.assessMaturityLevel(node)
      }
    };
  }

  /**
   * Convert Galyarder insights to knowledge entities
   */
  static mapInsightToKnowledge(insight: GalyarderInsight, index: number): InsightKnowledgeEntity {
    const baseEntity: KnowledgeEntity = {
      id: `insight_${index}`,
      type: KnowledgeType.INSIGHT,
      title: this.generateInsightTitle(insight),
      content: insight.text,
      summary: this.generateInsightSummary(insight),
      metadata: {
        source: 'galyarder_insights',
        author: 'Galyarder',
        tags: [...insight.contextKeywords, insight.category],
        category: 'insight',
        subcategory: insight.category,
        confidence_score: 0.9,
        relevance_score: this.calculateInsightRelevance(insight),
        access_level: AccessLevel.PUBLIC,
        project_associations: this.findInsightProjectAssociations(insight),
        client_associations: [],
        technology_stack: this.inferInsightTechnologyStack(insight),
        verification_status: 'verified',
        last_validated: new Date().toISOString()
      },
      relationships: [],
      embeddings: {
        content_embedding: [],
        summary_embedding: [],
        title_embedding: [],
        embedding_model: 'text-embedding-ada-002',
        embedding_version: '1.0',
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      checksum: this.generateChecksum(insight)
    };

    return {
      ...baseEntity,
      insight_data: {
        category: insight.category,
        context_keywords: insight.contextKeywords,
        application_domains: this.inferApplicationDomains(insight),
        supporting_evidence: this.findSupportingEvidence(insight),
        counter_examples: this.findCounterExamples(insight)
      }
    };
  }

  /**
   * Convert testimonials to knowledge entities
   */
  static mapTestimonialToKnowledge(testimonial: Testimonial): KnowledgeEntity {
    return {
      id: `testimonial_${testimonial.id}`,
      type: KnowledgeType.TESTIMONIAL,
      title: `Client Testimonial: ${testimonial.author} - ${testimonial.company}`,
      content: this.generateTestimonialContent(testimonial),
      summary: testimonial.quote,
      metadata: {
        source: 'client_testimonials',
        author: testimonial.author,
        tags: this.generateTestimonialTags(testimonial),
        category: 'testimonial',
        subcategory: testimonial.category,
        confidence_score: 1.0,
        relevance_score: this.calculateTestimonialRelevance(testimonial),
        access_level: AccessLevel.PUBLIC,
        project_associations: testimonial.relatedProjectId ? [testimonial.relatedProjectId] : [],
        client_associations: [testimonial.company],
        technology_stack: [],
        business_impact: testimonial.impact ? { roi_improvement: testimonial.impact } : undefined,
        verification_status: 'verified',
        last_validated: new Date().toISOString()
      },
      relationships: this.generateTestimonialRelationships(testimonial),
      embeddings: {
        content_embedding: [],
        summary_embedding: [],
        title_embedding: [],
        embedding_model: 'text-embedding-ada-002',
        embedding_version: '1.0',
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      checksum: this.generateChecksum(testimonial)
    };
  }

  // Helper methods for content generation
  private static generateProjectContent(project: ProjectMetrics): string {
    return `
# ${project.project_name}

## Objective
${project.objective}

## System Architecture
${project.system_architecture}

## Outcome
${project.outcome}

## Technical Implementation
Technology Stack: ${project.tech_stack.join(', ')}

${project.visual_flow ? `## Data Flow\n${project.visual_flow}` : ''}

## Performance Metrics
${Object.entries(project.metrics).map(([key, value]) => `- ${key.replace('_', ' ')}: ${value}`).join('\n')}

## Status
Current Status: ${project.status.toUpperCase()}
    `.trim();
  }

  private static generateBlueprintContent(node: BlueprintNode): string {
    return `
# ${node.label}

## Description
${node.description}

${node.implementation ? `## Implementation\n${node.implementation}` : ''}

${node.examples && node.examples.length > 0 ? `## Examples\n${node.examples.map(ex => `- ${ex}`).join('\n')}` : ''}

## Category
${node.category} - ${node.isSectionHeader ? 'Section Header' : 'Implementation Detail'}

${node.parentNode ? `## Parent Principle\n${node.parentNode}` : ''}
    `.trim();
  }

  private static generateTestimonialContent(testimonial: Testimonial): string {
    return `
# Client Testimonial: ${testimonial.company}

## Quote
"${testimonial.quote}"

## Client Information
- **Name**: ${testimonial.author}
- **Role**: ${testimonial.role}
- **Company**: ${testimonial.company}
- **Category**: ${testimonial.category}

${testimonial.impact ? `## Business Impact\n${testimonial.impact}` : ''}

${testimonial.relatedProjectId ? `## Related Project\n${testimonial.relatedProjectId}` : ''}
${testimonial.relatedExpertiseId ? `## Related Expertise\n${testimonial.relatedExpertiseId}` : ''}
    `.trim();
  }

  // Helper methods for insight generation
  private static generateInsightTitle(insight: GalyarderInsight): string {
    const category = insight.category.charAt(0).toUpperCase() + insight.category.slice(1);
    const textSnippet = insight.text.split(' ').slice(0, 6).join(' ');
    return `${category}: ${textSnippet}${insight.text.split(' ').length > 6 ? '...' : ''}`;
  }

  private static generateInsightSummary(insight: GalyarderInsight): string {
    return insight.text.length > 200 ? insight.text.substring(0, 200) + '...' : insight.text;
  }

  // Helper methods for tag generation
  private static generateProjectTags(project: ProjectMetrics): string[] {
    const tags = [
      'project',
      project.status,
      ...project.tech_stack.map(tech => tech.toLowerCase()),
      ...Object.keys(project.metrics)
    ];

    // Add domain-specific tags
    if (project.id.includes('airdrop')) tags.push('web3', 'defi', 'automation');
    if (project.id.includes('galyarder')) tags.push('productivity', 'personal', 'ai');
    if (project.id.includes('prompt')) tags.push('ai', 'llm', 'workflow');

    return [...new Set(tags)];
  }

  private static generateBlueprintTags(node: BlueprintNode): string[] {
    return [
      'blueprint',
      'architecture',
      node.category,
      ...node.label.toLowerCase().split(' '),
      ...(node.examples || []).flatMap(ex => ex.toLowerCase().split(' ').slice(0, 2))
    ].filter(tag => tag.length > 2);
  }

  private static generateTestimonialTags(testimonial: Testimonial): string[] {
    return [
      'testimonial',
      'client-feedback',
      testimonial.category,
      testimonial.company.toLowerCase().replace(/\s+/g, '-'),
      ...(testimonial.relatedProjectId ? [testimonial.relatedProjectId] : []),
      ...(testimonial.relatedExpertiseId ? [testimonial.relatedExpertiseId] : [])
    ];
  }

  // Helper methods for relationship generation
  private static generateBlueprintRelationships(node: BlueprintNode): any[] {
    const relationships = [];

    if (node.parentNode) {
      relationships.push({
        target_id: `blueprint_${node.parentNode}`,
        relationship_type: RelationshipType.EXTENDS,
        strength: 0.9,
        context: 'Hierarchical blueprint relationship',
        bidirectional: false,
        created_at: new Date().toISOString(),
        validated: true
      });
    }

    return relationships;
  }

  private static generateTestimonialRelationships(testimonial: Testimonial): any[] {
    const relationships = [];

    if (testimonial.relatedProjectId) {
      relationships.push({
        target_id: `project_${testimonial.relatedProjectId}`,
        relationship_type: RelationshipType.VALIDATES,
        strength: 0.95,
        context: 'Client testimonial validates project outcomes',
        bidirectional: false,
        created_at: new Date().toISOString(),
        validated: true
      });
    }

    return relationships;
  }

  // Utility methods
  private static calculateProjectRelevance(project: ProjectMetrics): number {
    let relevance = 0.7; // Base relevance
    
    if (project.status === 'production') relevance += 0.2;
    if (Object.keys(project.metrics).length > 2) relevance += 0.1;
    
    return Math.min(relevance, 1.0);
  }

  private static calculateBlueprintRelevance(node: BlueprintNode): number {
    let relevance = 0.8; // Base relevance for architectural principles
    
    if (node.isSectionHeader) relevance += 0.1;
    if (node.examples && node.examples.length > 0) relevance += 0.1;
    
    return Math.min(relevance, 1.0);
  }

  private static calculateInsightRelevance(insight: GalyarderInsight): number {
    return 0.85; // High relevance for curated insights
  }

  private static calculateTestimonialRelevance(testimonial: Testimonial): number {
    let relevance = 0.9; // High relevance for client validation
    
    if (testimonial.impact) relevance += 0.05;
    if (testimonial.relatedProjectId) relevance += 0.05;
    
    return Math.min(relevance, 1.0);
  }

  private static generateChecksum(data: any): string {
    try {
      // Convert data to JSON string
      const jsonString = JSON.stringify(data);
      
      // Encode to UTF-8 bytes using TextEncoder
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(jsonString);
      
      // Convert bytes to binary string for btoa compatibility
      const binaryString = String.fromCharCode(...utf8Bytes);
      
      // Generate base64 checksum
      return btoa(binaryString).slice(0, 16);
    } catch (error) {
      // Fallback to simple hash if btoa still fails
      let hash = 0;
      const str = JSON.stringify(data);
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16).slice(0, 16);
    }
  }

  // Additional helper methods would be implemented here...
  private static extractArchitecturePatterns(project: ProjectMetrics): string[] {
    // Extract patterns from system architecture description
    const patterns = [];
    const arch = project.system_architecture.toLowerCase();
    
    if (arch.includes('microservice')) patterns.push('microservices');
    if (arch.includes('event-driven')) patterns.push('event-driven');
    if (arch.includes('async')) patterns.push('async-first');
    if (arch.includes('modular')) patterns.push('modular-design');
    
    return patterns;
  }

  private static extractLessonsLearned(project: ProjectMetrics): string[] {
    // This would be populated from project documentation
    return [
      'Async-first architecture enables better scalability',
      'Modular design facilitates independent component evolution',
      'Comprehensive testing reduces production issues'
    ];
  }

  private static estimateDeploymentDate(project: ProjectMetrics): string {
    // Estimate based on project status and current date
    if (project.status === 'production') {
      return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 3 months ago
    }
    return new Date().toISOString();
  }

  private static estimateDuration(project: ProjectMetrics): number {
    // Estimate project duration based on complexity
    const techStackSize = project.tech_stack.length;
    const metricsCount = Object.keys(project.metrics).length;
    
    return Math.max(1, Math.floor((techStackSize + metricsCount) / 2));
  }

  // Placeholder methods for missing functionality
  private static findRelatedProjects(node: BlueprintNode): string[] {
    return []; // To be implemented
  }

  private static inferTechnologyStack(node: BlueprintNode): string[] {
    return []; // To be implemented
  }

  private static generateAntiPatterns(node: BlueprintNode): string[] {
    return []; // To be implemented
  }

  private static generateDecisionCriteria(node: BlueprintNode): string[] {
    return []; // To be implemented
  }

  private static generateTradeOffs(node: BlueprintNode): string[] {
    return []; // To be implemented
  }

  private static assessMaturityLevel(node: BlueprintNode): string {
    return 'mature'; // To be implemented
  }

  private static findInsightProjectAssociations(insight: GalyarderInsight): string[] {
    return []; // To be implemented
  }

  private static inferInsightTechnologyStack(insight: GalyarderInsight): string[] {
    return []; // To be implemented
  }

  private static inferApplicationDomains(insight: GalyarderInsight): string[] {
    return []; // To be implemented
  }

  private static findSupportingEvidence(insight: GalyarderInsight): string[] {
    return []; // To be implemented
  }

  private static findCounterExamples(insight: GalyarderInsight): string[] {
    return []; // To be implemented
  }
}