import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  CheckCircle2, 
  Globe, 
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase,
  ShoppingCart,
  Stethoscope,
  MousePointer2,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, useSpring } from 'framer-motion';
import './LandingPage.css';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Parallax Transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.3], [0, 5]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.1]);
  
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  const features = [
    {
      icon: <Zap size={24} />,
      title: "Instant AI Analysis",
      description: "Automatically analyze urgency and intent the moment a ticket arrives using AWS Bedrock.",
      color: "#6366f1"
    },
    {
      icon: <Shield size={24} />,
      title: "Sentiment Detection",
      description: "Detect customer emotions using Amazon Comprehend to prioritize frustrated users.",
      color: "#f43f5e"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Intelligent Routing",
      description: "Automatically route tickets to the best-suited agent based on expertise and workload.",
      color: "#22d3ee"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Smart Suggested Replies",
      description: "Give agents a head start with AI-generated response drafts for every incoming ticket.",
      color: "#a855f7"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Ingest",
      description: "Connect your support channels. Tickets flow in and are immediately indexed by the AI engine."
    },
    {
      number: "02",
      title: "Analyze",
      description: "Bedrock and Comprehend work together to determine urgency, sentiment, and category."
    },
    {
      number: "03",
      title: "Resolve",
      description: "Agents receive prioritized queues with AI-assisted insights to solve issues 3x faster."
    }
  ];

  const useCases = [
    {
      industry: "E-Commerce",
      icon: <ShoppingCart size={20} />,
      benefit: "Prioritize hardware failures and payment issues to prevent revenue loss."
    },
    {
      industry: "Healthcare",
      icon: <Stethoscope size={20} />,
      benefit: "Escalate patient emergencies and sensitive data requests with absolute precision."
    },
    {
      industry: "SaaS",
      icon: <Briefcase size={20} />,
      benefit: "Manage developer API bugs and enterprise feature requests efficiently."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const metrics = [
    { label: "AI Analysis", value: "3.2s", detail: "Avg. Speed" },
    { label: "Accuracy", value: "98.4%", detail: "Bedrock Nova" },
    { label: "Automation", value: "65%", detail: "Self-Routed" }
  ];

  return (
    <div className="landing-container">
      {/* 3D Floating Blobs with Parallax */}
      <motion.div 
        className="blob blob-1"
        style={{ y: blob1Y }}
        animate={{ 
          x: [0, 40, 0], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="blob blob-2"
        style={{ y: blob2Y }}
        animate={{ 
          x: [0, -30, 0], 
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Primary Navigation */}
      <nav className="landing-nav glass-panel">
        <div className="landing-nav-logo">
          <img src="/logo.png" alt="AegisAI" className="landing-logo-img" />
          <span>AegisAI</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">Process</a>
          <a href="#use-cases">Industries</a>
          <Link to="/dashboard" className="nav-btn primary-gradient">
            Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section className="hero-section" style={{ scale, opacity }}>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-badge glass-panel"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <img src="/logo.png" alt="Logo" className="hero-badge-logo" />
            <span>Scale Support with AegisAI</span>
          </motion.div>
          
          <h1 className="hero-title text-gradient">
            AI-Powered Smart Ticket Triage System
          </h1>
          
          <p className="hero-subtitle">
            The only AI-first ticketing engine that <strong>thinks, prioritizes, and resolves</strong>. Powered by AegisAI to identify critical issues before they become crises.
          </p>
          
          <div className="hero-actions">
            <Link to="/dashboard" className="hero-btn primary-gradient glow-shadow">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <button className="hero-btn-outline glass-panel" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              <MousePointer2 size={16} /> Explore Features
            </button>
          </div>

          {/* Hero Metrics Strip */}
          <motion.div 
            className="hero-metrics glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="metric-item">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D App Preview with Parallax */}
        <motion.div 
          className="hero-visual perspective-1000"
          style={{ y: heroY, rotate: heroRotate }}
          initial={{ opacity: 0, rotateY: 20, x: 50 }}
          animate={{ opacity: 1, rotateY: -10, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <motion.div 
            className="hero-glass-card glass-panel"
            whileHover={{ rotateY: 8, rotateX: -8, scale: 1.05 }}
            style={{ 
              transformStyle: "preserve-3d",
              boxShadow: "0 50px 100px rgba(0,0,0,0.5)"
            }}
          >
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot amber"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-body" style={{ transform: "translateZ(50px)" }}>
              <div className="skeleton-line full"></div>
              <div className="skeleton-line half"></div>
              <div className="ai-insight-box glass-panel glow-accent">
                <Sparkles size={16} className="text-accent" />
                <span>AI Urgency: Critical</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header-centered">
          <motion.h2 
            className="section-title text-gradient"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
          >
            Supercharged Features
          </motion.h2>
          <p className="section-subtitle">A precision-engineered dashboard for elite support teams.</p>
        </div>

        <motion.div 
          className="features-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className="feature-card glass-card"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              whileHover={{ 
                y: -15, 
                rotateX: 15, 
                rotateY: 15,
                transition: { duration: 0.2 }
              }}
              style={{ 
                transformStyle: "preserve-3d",
                marginTop: i % 2 === 0 ? "0px" : "40px" // Subtle visual stagger
              }}
            >
              <div className="feature-icon-wrapper" style={{ transform: "translateZ(30px)" }}>
                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="feature-title" style={{ transform: "translateZ(20px)" }}>{feature.title}</h3>
              <p className="feature-desc" style={{ transform: "translateZ(10px)" }}>{feature.description}</p>
              <div className="card-reflection"></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Operational Workflow */}
      <section id="how-it-works" className="how-section glass-panel">
        <div className="how-grid">
          <div className="how-content">
            <h2 className="section-title text-gradient">How it Works</h2>
            <p className="section-subtitle">A seamless pipeline from ingestion to resolution.</p>
            
            <div className="steps-list">
              {steps.map((step, i) => (
                <motion.div 
                  key={i} 
                  className="step-item"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                >
                  <div className="step-number text-gradient">{step.number}</div>
                  <div className="step-info">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="how-visual-container">
            <div className="workflow-graphic glass-panel">
               {/* Visual representation of workflow */}
               <div className="flow-node flow-node-1 glass-card">Incoming</div>
               <div className="flow-line"></div>
               <div className="flow-node flow-node-2 ai-node glass-panel"><Sparkles size={20} /> AI</div>
               <div className="flow-line"></div>
               <div className="flow-node flow-node-3 glass-card">Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="use-cases" className="use-cases-section">
        <div className="section-header-centered">
          <h2 className="section-title text-gradient">Tailored to Your Industry</h2>
          <p className="section-subtitle">Every sector. Every ticket. Every context.</p>
        </div>

        <div className="use-cases-grid">
          {useCases.map((useCase, i) => (
            <motion.div 
              key={i} 
              className="use-case-card glass-panel"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <div className="use-case-industry">
                {useCase.icon}
                <span>{useCase.industry}</span>
              </div>
              <p className="use-case-benefit">{useCase.benefit}</p>
              <button className="use-case-link">
                Learn More <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section">
        <motion.div 
          className="cta-card glass-panel animate-glow"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Ready to Automate your Support?</h2>
          <p className="cta-desc">Join the waitlist or start your 14-day free trial today.</p>
          <div className="cta-actions">
            <Link to="/dashboard" className="cta-btn primary-gradient">
              Get Started Now <ArrowRight size={18} />
            </Link>
            <button className="cta-btn-ghost">
              Check Pricing
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles className="text-secondary" />
              <span>AegisAI</span>
            </div>
            <p>Shielding your support team with intelligence.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h5>Product</h5>
              <a href="#">Features</a>
              <a href="#">Integrations</a>
              <a href="#">Enterprise</a>
            </div>
            <div className="footer-links-col">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Privacy</a>
            </div>
            <div className="footer-links-col">
              <h5>Platform</h5>
              <a href="#">AWS Support</a>
              <a href="#">API Docs</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom glass-panel">
          <p>&copy; 2026 AegisAI. Built with Bedrock & Comprehend.</p>
          <div className="social-links">
            <Globe size={18} />
            <Globe size={18} />
            <Globe size={18} />
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="back-to-top glass-panel neon-glow-cyan"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            whileHover={{ y: -5, scale: 1.1 }}
          >
            <ChevronUp size={24} className="text-secondary" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
