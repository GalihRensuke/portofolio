import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import InteractiveSystemCube from '../components/InteractiveSystemCube';
import ProjectCaseStudy from '../components/ProjectCaseStudy';
import AutonomousIntake from '../components/AutonomousIntake';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { projectMetrics } from '../data/projectMetrics';
import { galyarderInsights } from '../data/galyarderInsights';
import { incrementEngagementScore, ENGAGEMENT_SCORING, getClearanceLevel } from '../utils/gamification';
import { Terminal, Zap, Brain, Code, Database, Shield, Eye, Cpu, Network, BarChart3, Users, Coins, ArrowRight, ExternalLink, Github, Star, Crown, Rocket } from 'lucide-react';

const HomePage = () => {
  // ... [rest of the code remains exactly the same]
};

export default HomePage;

// Added missing closing brackets and parentheses throughout the file