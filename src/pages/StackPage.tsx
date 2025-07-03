import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Brain, Coins, Wrench } from 'lucide-react';
import { useUserBehaviorStore } from '../store/userBehaviorStore';

const StackPage = () => {
  const [activeCategory, setActiveCategory] = useState('Frontend');
  const { setCurrentPage } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/stack');
  }, [setCurrentPage]);

  const stackCategories = {
    Frontend: {
      icon: Code,
      tools: [
        { name: 'React', desc: 'Component-based UI development' },
        { name: 'Next.js', desc: 'Full-stack React framework' },
        { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
        { name: 'shadcn/ui', desc: 'Reusable component library' },
        { name: 'Vite', desc: 'Fast build tool and dev server' },
        { name: 'TypeScript', desc: 'Type-safe JavaScript' }
      ]
    },
    'Backend/Infra': {
      icon: Server,
      tools: [
        { name: 'Supabase', desc: 'Backend-as-a-Service platform' },
        { name: 'Cloudflare', desc: 'Edge computing and CDN' },
        { name: 'PostgreSQL', desc: 'Relational database system' },
        { name: 'n8n', desc: 'Workflow automation platform' },
        { name: 'Docker', desc: 'Containerization platform' },
        { name: 'Vercel', desc: 'Deployment and hosting' }
      ]
    },
    'AI Layer': {
      icon: Brain,
      tools: [
        { name: 'OpenRouter', desc: 'Unified API for LLM access' },
        { name: 'Gemini Pro', desc: 'Google\'s multimodal AI model' },
        { name: 'LangChain', desc: 'Framework for LLM applications' },
        { name: 'Whisper', desc: 'Speech recognition by OpenAI' },
        { name: 'GPT-4', desc: 'Advanced language model' },
        { name: 'Embeddings', desc: 'Vector representations for search' }
      ]
    },
    Web3: {
      icon: Coins,
      tools: [
        { name: 'Solidity', desc: 'Smart contract programming' },
        { name: 'Foundry', desc: 'Ethereum development toolkit' },
        { name: 'RainbowKit', desc: 'Wallet connection library' },
        { name: 'Wagmi', desc: 'React hooks for Ethereum' },
        { name: 'Ethers.js', desc: 'Ethereum JavaScript library' },
        { name: 'The Graph', desc: 'Decentralized indexing protocol' }
      ]
    },
    'Dev Tools': {
      icon: Wrench,
      tools: [
        { name: 'Git', desc: 'Version control system' },
        { name: 'Zod', desc: 'TypeScript-first schema validation' },
        { name: 'Zustand', desc: 'Lightweight state management' },
        { name: 'ESLint', desc: 'JavaScript linting utility' },
        { name: 'Prettier', desc: 'Code formatting tool' },
        { name: 'Turborepo', desc: 'Monorepo build system' }
      ]
    }
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tech Stack</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tools and technologies I use to build scalable, maintainable systems.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/4"
          >
            <div className="space-y-2">
              {Object.entries(stackCategories).map(([category, data]) => {
                const IconComponent = data.icon;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeCategory === category
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{category}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:w-3/4"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {stackCategories[activeCategory as keyof typeof stackCategories].tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2 text-indigo-500">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tool.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-4">Stack Philosophy</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-indigo-500">Selection Criteria</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Proven reliability in production</li>
                <li>• Strong community and documentation</li>
                <li>• Composable and interoperable</li>
                <li>• Performance and developer experience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-indigo-500">Architecture Principles</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Modular, loosely coupled systems</li>
                <li>• Type safety throughout the stack</li>
                <li>• Infrastructure as code</li>
                <li>• Observability and monitoring built-in</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StackPage;