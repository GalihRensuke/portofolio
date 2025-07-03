import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, CheckCircle, Zap, Brain, Target } from 'lucide-react';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'analysis' | 'generation' | 'optimization';
  variables: {
    name: string;
    label: string;
    placeholder: string;
    required: boolean;
  }[];
  template: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'chain_of_thought',
    name: 'Chain-of-Thought Analysis',
    description: 'Structured problem decomposition with step-by-step reasoning',
    category: 'analysis',
    variables: [
      {
        name: 'problem',
        label: 'Problem Statement',
        placeholder: 'Describe the problem you want to analyze...',
        required: true,
      },
      {
        name: 'context',
        label: 'Context (Optional)',
        placeholder: 'Additional context or constraints...',
        required: false,
      },
    ],
    template: `# Chain-of-Thought Analysis

## Problem Statement
{{problem}}

{{#if context}}
## Context
{{context}}
{{/if}}

## Analysis Framework

### Step 1: Problem Decomposition
Break down the problem into its fundamental components:
- Core issue identification
- Stakeholder analysis
- Constraint mapping

### Step 2: First Principles Thinking
Examine each component from first principles:
- What are the underlying assumptions?
- What are the immutable constraints?
- What are the variables we can control?

### Step 3: Solution Architecture
Design potential solutions:
- Map solution components to problem components
- Identify dependencies and sequencing
- Assess feasibility and resource requirements

### Step 4: Risk Assessment
Evaluate potential failure modes:
- What could go wrong?
- What are the mitigation strategies?
- What are the early warning indicators?

### Step 5: Implementation Roadmap
Create actionable next steps:
- Prioritize by impact and effort
- Define success metrics
- Establish feedback loops

Please provide a comprehensive analysis following this framework.`,
  },
  {
    id: 'system_design',
    name: 'System Architecture Prompt',
    description: 'Generate technical architecture documentation',
    category: 'generation',
    variables: [
      {
        name: 'system_name',
        label: 'System Name',
        placeholder: 'e.g., User Authentication Service',
        required: true,
      },
      {
        name: 'requirements',
        label: 'Key Requirements',
        placeholder: 'List the main functional and non-functional requirements...',
        required: true,
      },
    ],
    template: `# System Architecture: {{system_name}}

## Requirements Analysis
{{requirements}}

## Architecture Design

### High-Level Architecture
Design a scalable, maintainable system architecture that addresses the requirements above. Include:

1. **System Components**
   - Core services and their responsibilities
   - Data storage layers
   - External integrations
   - User interfaces

2. **Data Flow**
   - Request/response patterns
   - Data transformation points
   - Caching strategies
   - Event flows

3. **Technology Stack**
   - Recommended technologies for each layer
   - Justification for technology choices
   - Alternative options and trade-offs

4. **Scalability Considerations**
   - Horizontal scaling strategies
   - Performance bottlenecks
   - Load balancing approaches
   - Database scaling patterns

5. **Security Architecture**
   - Authentication and authorization
   - Data protection measures
   - Network security
   - Compliance considerations

6. **Operational Concerns**
   - Monitoring and observability
   - Deployment strategies
   - Disaster recovery
   - Maintenance procedures

Please provide a comprehensive system architecture document following this structure.`,
  },
  {
    id: 'code_optimization',
    name: 'Code Optimization Analysis',
    description: 'Analyze and optimize code for performance and maintainability',
    category: 'optimization',
    variables: [
      {
        name: 'code_snippet',
        label: 'Code to Optimize',
        placeholder: 'Paste your code here...',
        required: true,
      },
      {
        name: 'optimization_goals',
        label: 'Optimization Goals',
        placeholder: 'e.g., improve performance, reduce complexity, enhance readability...',
        required: true,
      },
    ],
    template: `# Code Optimization Analysis

## Original Code
\`\`\`
{{code_snippet}}
\`\`\`

## Optimization Goals
{{optimization_goals}}

## Analysis Framework

### 1. Code Quality Assessment
Analyze the code for:
- **Complexity**: Cyclomatic complexity, nesting levels
- **Readability**: Variable naming, function structure, comments
- **Maintainability**: Modularity, coupling, cohesion
- **Performance**: Time complexity, space complexity, bottlenecks

### 2. Optimization Opportunities
Identify specific improvements:
- **Performance optimizations**: Algorithm improvements, caching, lazy loading
- **Code structure**: Refactoring opportunities, design patterns
- **Resource usage**: Memory optimization, I/O efficiency
- **Error handling**: Robustness improvements

### 3. Optimized Implementation
Provide improved version(s) with:
- Cleaner, more readable code
- Better performance characteristics
- Enhanced maintainability
- Proper error handling

### 4. Trade-off Analysis
Discuss:
- Performance vs. readability trade-offs
- Memory vs. speed considerations
- Complexity vs. flexibility balance
- Implementation effort vs. benefits

### 5. Testing Strategy
Recommend:
- Unit test cases for the optimized code
- Performance benchmarking approach
- Edge case validation
- Regression testing considerations

Please provide a comprehensive optimization analysis following this framework.`,
  },
];

interface PromptCodexSandboxProps {
  onPromptGenerated?: () => void;
}

const PromptCodexSandbox: React.FC<PromptCodexSandboxProps> = ({ onPromptGenerated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(promptTemplates[0]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setVariables({});
    setGeneratedPrompt('');
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple template engine (in production, use a proper template library)
    let prompt = selectedTemplate.template;
    
    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      prompt = prompt.replace(regex, value);
    });
    
    // Handle conditional blocks (simplified)
    prompt = prompt.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });
    
    setGeneratedPrompt(prompt);
    setIsGenerating(false);
    
    // Award engagement points for using the sandbox
    incrementEngagementScore(ENGAGEMENT_SCORING.SANDBOX_USAGE);
    
    // Notify parent component if callback provided
    if (onPromptGenerated) {
      onPromptGenerated();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = selectedTemplate.variables
    .filter(v => v.required)
    .every(v => variables[v.name]?.trim());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis': return Brain;
      case 'generation': return Zap;
      case 'optimization': return Target;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'generation': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'optimization': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Prompt Codex Sandbox</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience structured prompt engineering in action. Select a template, provide variables, 
          and generate production-ready prompts using our DSL-based composition system.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Select Template</h3>
          {promptTemplates.map((template) => {
            const IconComponent = getCategoryIcon(template.category);
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  selectedTemplate.id === template.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-5 w-5 text-indigo-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                      <h4 className="font-semibold text-white truncate">{template.name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${getCategoryColor(template.category)} whitespace-nowrap`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Variable Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Configure Variables</h3>
          <div className="space-y-4">
            {selectedTemplate.variables.map((variable) => (
              <div key={variable.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {variable.label} {variable.required && <span className="text-red-400">*</span>}
                </label>
                <textarea
                  value={variables[variable.name] || ''}
                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                  placeholder={variable.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>

          <button
            onClick={generatePrompt}
            disabled={!canGenerate || isGenerating}
            className="w-full flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isGenerating ? (
              'Generating...'
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Prompt
              </>
            )}
          </button>
        </div>

        {/* Generated Output */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h3 className="flex-1 truncate text-lg font-semibold text-white">Generated Prompt</h3>
            {generatedPrompt && (
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-lg hover:border-indigo-500/40 transition-colors whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-y-auto">
            {generatedPrompt ? (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-center">
                Configure variables and click "Generate Prompt" to see the output
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="p-6 bg-gray-900 border border-gray-700 rounded-lg"
      >
        <h4 className="font-semibold text-white mb-3">System Architecture</h4>
        <p className="text-gray-300 text-sm mb-4">
          This sandbox demonstrates the Prompt Codex DSL-based composition system. Templates use 
          structured variables and conditional logic to generate consistent, production-ready prompts.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-indigo-400 font-medium">Template Engine:</span>
            <span className="text-gray-300 ml-2">Handlebars-style syntax</span>
          </div>
          <div>
            <span className="text-indigo-400 font-medium">Variable Injection:</span>
            <span className="text-gray-300 ml-2">Type-safe validation</span>
          </div>
          <div>
            <span className="text-indigo-400 font-medium">Output Format:</span>
            <span className="text-gray-300 ml-2">Structured markdown</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromptCodexSandbox;