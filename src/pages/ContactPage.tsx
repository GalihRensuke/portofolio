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
      link: '#schedule-call',
      external: false,
      isWebhook: true
    }
  ];

  const handleScheduleCall = async () => {
    try {
      console.log('📅 Scheduling call via N8N webhook...');
      
      const payload = {
        action: 'schedule_call',
        timestamp: new Date().toISOString(),
        source: 'contact_page_direct',
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n-fhehrtub.us-west-1.clawcloudrun.com/webhook/b653569b-761b-40ad-870e-1cc3c12e8bd2';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'galyarder-portfolio-schedule',
          'X-Action': 'schedule_call'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.calendly_url) {
          window.open(data.calendly_url, '_blank');
        } else {
          // Fallback to direct contact
          window.location.href = 'mailto:admin@galyarder.my.id?subject=Schedule a Call&body=I would like to schedule a consultation call to discuss my project.';
        }
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      console.error('Schedule call webhook failed:', error);
      // Fallback to email
      window.location.href = 'mailto:admin@galyarder.my.id?subject=Schedule a Call&body=I would like to schedule a consultation call to discuss my project.';
    }
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
                    if (method.isWebhook) {
                      handleScheduleCall();
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
                    {method.title === 'Professional Email' && (
                      <p className="text-xs text-indigo-400 mt-1">admin@galyarder.my.id</p>
                    )}
                    {method.title === 'Personal Email' && (
                      <p className="text-xs text-indigo-400 mt-1">muhamadgs@galyarder.my.id</p>
                    )}
                    {method.title === 'GitHub' && (
                      <p className="text-xs text-indigo-400 mt-1">github.com/GalyarderOS</p>
                    )}
                    {method.title === 'Telegram' && (
                      <p className="text-xs text-indigo-400 mt-1">@galyarders</p>
                    )}
                    {method.isWebhook && (
                      <p className="text-xs text-green-400 mt-1">Via N8N webhook integration</p>
                    )}
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
                <div className="flex justify-between">
                  <span>Schedule calls:</span>
                  <span className="text-purple-400">N8N webhook</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-2">Contact Preferences</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>• Professional inquiries: admin@galyarder.my.id</div>
                  <div>• Personal communication: muhamadgs@galyarder.my.id</div>
                  <div>• Quick discussions: Telegram @galyarders</div>
                  <div>• Code collaboration: GitHub.com/GalyarderOS</div>
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