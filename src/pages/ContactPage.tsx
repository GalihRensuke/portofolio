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
      link: 'https://github.com/GalyarderOS/',
      external: true
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      desc: 'Direct message for quick discussions',
      link: 'https://t.me/galyarders',
      external: true
    },
    {
      icon: Mail,
      title: 'Professional Email',
      desc: 'For formal inquiries and collaborations',
      link: 'mailto:admin@galyarder.my.id',
      external: true
    },
    {
      icon: Mail,
      title: 'Personal Email',
      desc: 'Direct personal communication',
      link: 'mailto:muhamadgs@galyarder.my.id',
      external: true
    },
    {
      icon: Calendar,
      title: 'Schedule a Call',
      desc: 'Book a meeting to discuss your project',
      link: '#',
      external: false,
      isAITrigger: true
    }
  ];

  const triggerAIScheduling = () => {
    // Trigger the AI concierge with scheduling context
    const aiConciergeEvent = new CustomEvent('triggerAIConcierge', {
      detail: {
        message: "I would like to schedule a consultation call to discuss my project. What's the best way to proceed?",
        context: 'scheduling_request',
        source: 'contact_page_direct'
      }
    });
    
    window.dispatchEvent(aiConciergeEvent);
  };

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
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (method.isAITrigger) {
                      triggerAIScheduling();
                    } else if (method.external) {
                      window.open(method.link, '_blank');
                    } else {
                      window.location.href = method.link;
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <method.icon className="h-6 w-6 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{method.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <h3 className="font-semibold mb-3">Contact Preferences</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div>• <strong>Professional:</strong> admin@galyarder.my.id</div>
                <div>• <strong>Personal:</strong> muhamadgs@galyarder.my.id</div>
                <div>• <strong>Quick chat:</strong> @galyarders</div>
                <div>• <strong>Code:</strong> github.com/GalyarderOS</div>
                <div>• <strong>Schedule:</strong> AI-powered booking</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;