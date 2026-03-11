import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroScene3D from './HeroScene3D';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-canvas-wrap">
        <HeroScene3D />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="badge-dot" />
          AI Security Testing Platform
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Stress Test Your AI
          <br />
          <span className="gradient-text">Before Attackers Do.</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Simulate real Denial‑of‑Service attacks against AI&nbsp;models and uncover
          hidden vulnerabilities before they reach production.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link to="/dashboard" className="hero-btn-primary">
            Start Testing
            <span style={{ fontSize: '16px' }}>→</span>
          </Link>
          <a href="#features" className="hero-btn-secondary">
            View Live Demo
            <span style={{ fontSize: '14px' }}>▶</span>
          </a>
        </motion.div>
      </motion.div>

      <div className="hero-glow-bottom" />
    </section>
  );
}
