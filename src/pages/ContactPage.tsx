import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, MessageCircle, Calendar, Mail, Zap } from 'lucide-react';
import AutonomousIntake from '../components/AutonomousIntake';
import { useUserBehaviorStore } from '../store/userBehaviorStore';

const ContactPage = () => {
  const { setCurrentPage } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/contact');
  }, [setCurrentPage]);

  const contactMethods = [
    {
      icon: Github,
      title: 'GitHub',
      desc: 'Check out my repositories and contributions',
      link: 'https://github.com/galyarder',
      external: true
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      desc: 'Direct message for quick discussions',
      link: 'https://t.me/galyarder',
      external: true
    },
    {
      icon: Mail,
      title: 'Email',
      desc: 'For formal inquiries and collaborations',
      link: 'mailto:hello@galyarder.dev',
      external: true
    },
    {
      icon: Calendar,
      title: 'Schedule a Call',
      desc: 'Book a meeting to discuss your project',
      link: '#',
      external: false
    }
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Autonomous Intake</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Intelligent client qualification system. High-value opportunities are fast-tracked, 
            while general inquiries receive automated responses with relevant resources.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Autonomous Intake Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-950 border border-gray-800 rounded-lg p-8"
            >
              <AutonomousIntake />
            </motion.div>
          </div>

          {/* Alternative Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Direct Contact</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.link}
                  target={method.external ? "_blank" : "_self"}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <method.icon className="h-6 w-6 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{method.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <h3 className="font-semibold mb-3">System Architecture</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>High-value leads ({'>'} $15K):</span>
                  <span className="text-green-400">Auto-prioritized</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard inquiries:</span>
                  <span className="text-blue-400">24-48h response</span>
                </div>
                <div className="flex justify-between">
                  <span>Low-value/vague:</span>
                  <span className="text-gray-400">Auto-filtered</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;