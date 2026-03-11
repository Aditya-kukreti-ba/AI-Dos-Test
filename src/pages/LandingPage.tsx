import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroScene3D from '../landing/HeroScene3D';

/* ─────────────────────────────────────────────
   SCROLL-REVEAL WRAPPER
───────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 32 : 0,
      x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ text, color = 'teal' }: { text: string; color?: 'teal' | 'purple' | 'amber' }) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    teal: { bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.25)', text: '#14b8a6' },
    purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', text: '#8b5cf6' },
    amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  };
  const c = colors[color];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 14px', borderRadius: 20,
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: 11, fontWeight: 700,
      letterSpacing: '1px', textTransform: 'uppercase',
      marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.text }} />
      {text}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '14px 32px',
        background: scrolled ? 'rgba(15,23,42,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(148,163,184,0.08)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 1200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: 'white',
            boxShadow: '0 0 16px rgba(20,184,166,0.35)',
          }}>◆</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>DOS Shield</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Features', 'Models', 'Analytics', 'How It Works'].map(item => (
            <a key={item} href={`#${item === 'How It Works' ? 'api' : item.toLowerCase()}`} style={{
              fontSize: 13.5, color: 'rgba(148,163,184,0.9)', textDecoration: 'none',
              fontWeight: 450, transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.9)')}
            >{item}</a>
          ))}
        </div>

        <Link to="/dashboard" style={{
          padding: '9px 22px', borderRadius: 10,
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: '#0a1628', fontSize: 13, fontWeight: 700,
          textDecoration: 'none', transition: 'all 0.25s',
          boxShadow: '0 4px 16px rgba(20,184,166,0.3)',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(20,184,166,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,184,166,0.3)'; e.currentTarget.style.transform = 'none'; }}
        >
          Start Testing →
        </Link>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES (pure CSS/SVG background)
───────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 8,
    color: i % 3 === 0 ? '#14b8a6' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b',
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: 0.6,
          }}
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 32px 60px', overflow: 'hidden',
    }}>
      {/* 3D Canvas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HeroScene3D />
      </div>

      {/* Particle field */}
      <ParticleField />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(20,184,166,0.07) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(139,92,246,0.05) 0%, transparent 60%)',
        zIndex: 1,
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Hero Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 760 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 24,
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.18)',
            color: '#14b8a6', fontSize: 12.5, fontWeight: 600,
            letterSpacing: '0.5px', marginBottom: 36,
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.span
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#14b8a6', display: 'block' }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          AI Security Testing Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(44px, 7vw, 76px)', fontWeight: 900,
            color: '#f8fafc', lineHeight: 1.08,
            letterSpacing: '-0.03em', marginBottom: 28,
          }}
        >
          Stress Test Your AI<br />
          <span style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #8b5cf6 50%, #14b8a6 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Before Attackers Do.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          style={{
            fontSize: 19, color: 'rgba(148,163,184,0.9)', lineHeight: 1.65,
            maxWidth: 560, margin: '0 auto 44px', fontWeight: 400,
          }}
        >
          Simulate real Denial‑of‑Service attacks against AI&nbsp;models and uncover
          hidden vulnerabilities before they reach production.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12,
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: '#0a1628', fontSize: 15, fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(20,184,166,0.35)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(20,184,166,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,184,166,0.35)'; }}
          >
            Start Testing <span>→</span>
          </Link>
          <a href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#e2e8f0', fontSize: 15, fontWeight: 600,
            textDecoration: 'none', backdropFilter: 'blur(12px)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; }}
          >
            ▶ View Live Demo
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60 }}
        >
          {[
            { value: '10K+', label: 'Tests Run' },
            { value: '5 Models', label: 'Supported' },
            { value: '99.9%', label: 'Accuracy' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.7)', marginTop: 4, letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: 'linear-gradient(transparent, #0f172a)',
        pointerEvents: 'none', zIndex: 2,
      }} />
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES SECTION
───────────────────────────────────────────── */
const features = [
  {
    icon: '🌊',
    title: 'Complex Prompt Flood',
    desc: 'Overwhelm models using recursive prompt structures that saturate context windows and force repeated computation cycles.',
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.18)',
    border: 'rgba(20,184,166,0.2)',
    path: '/dashboard',
    tag: 'Context Overflow',
  },
  {
    icon: '🔥',
    title: 'Token Exhaustion',
    desc: 'Drain token quotas and compute resources through carefully engineered prompts designed to maximize output length.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.18)',
    border: 'rgba(139,92,246,0.2)',
    path: '/dashboard',
    tag: 'Resource Drain',
  },
  {
    icon: '⚡',
    title: 'Batch Attack',
    desc: 'Simulate concurrent request bursts to stress-test API throughput and expose rate-limiting vulnerabilities.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    border: 'rgba(245,158,11,0.2)',
    path: '/dashboard',
    tag: 'Concurrency Stress',
  },
  {
    icon: '🎯',
    title: 'Model-Specific Exploit',
    desc: 'Discover architecture-specific vulnerabilities and target unique weaknesses in model internals and tokenization.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.18)',
    border: 'rgba(244,114,182,0.2)',
    path: '/dashboard',
    tag: 'Architecture Exploit',
  },
];

function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" style={{ padding: '120px 32px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <SectionLabel text="Attack Modules" color="teal" />
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 850,
              color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 16,
            }}>
              Four Vectors of Attack
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(148,163,184,0.8)', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
              Each module targets a distinct vulnerability surface, giving you complete coverage.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <Link to={f.path} style={{ textDecoration: 'none' }}>
                <motion.div
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  animate={{ y: hovered === i ? -6 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    padding: '32px 28px', borderRadius: 20, cursor: 'pointer',
                    background: 'rgba(17,24,39,0.6)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${hovered === i ? f.border : 'rgba(148,163,184,0.08)'}`,
                    boxShadow: hovered === i ? `0 20px 60px ${f.glow}, 0 0 0 1px ${f.border}` : '0 4px 24px rgba(0,0,0,0.2)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    height: '100%',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 54, height: 54, borderRadius: 14,
                    background: `rgba(${f.color === '#14b8a6' ? '20,184,166' : f.color === '#8b5cf6' ? '139,92,246' : f.color === '#f59e0b' ? '245,158,11' : '244,114,182'},0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 20,
                    border: `1px solid ${f.border}`,
                    boxShadow: hovered === i ? `0 0 20px ${f.glow}` : 'none',
                    transition: 'box-shadow 0.3s',
                  }}>
                    {f.icon}
                  </div>

                  {/* Tag */}
                  <div style={{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: 12,
                    background: `rgba(${f.color === '#14b8a6' ? '20,184,166' : f.color === '#8b5cf6' ? '139,92,246' : f.color === '#f59e0b' ? '245,158,11' : '244,114,182'},0.1)`,
                    color: f.color, fontSize: 10.5, fontWeight: 700,
                    letterSpacing: '0.6px', textTransform: 'uppercase',
                    marginBottom: 12, border: `1px solid ${f.border}`,
                  }}>
                    {f.tag}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', marginBottom: 10, letterSpacing: '-0.01em' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.75)', lineHeight: 1.65, marginBottom: 20 }}>
                    {f.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: f.color, fontSize: 13, fontWeight: 600 }}>
                    Launch Module
                    <motion.span
                      animate={{ x: hovered === i ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >→</motion.span>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD PREVIEW
───────────────────────────────────────────── */
function DashboardPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Prompt Flood', 'Token Exhaustion', 'Batch Attack'];

  return (
    <section style={{ padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 400,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel text="Interactive Dashboard" color="purple" />
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 850, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 14 }}>
              Built for Power Users
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(148,163,184,0.8)', maxWidth: 480, margin: '0 auto' }}>
              Configure, launch, and analyze attacks from a single glass-panel dashboard.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          {/* Glass dashboard mockup */}
          <div style={{
            background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(148,163,184,0.1)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(148,163,184,0.06)',
          }}>
            {/* Window bar */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid rgba(148,163,184,0.07)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.02)',
            }}>
              {['#ff5f56', '#febc2e', '#28c840'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
              <div style={{
                flex: 1, display: 'flex', justifyContent: 'center',
              }}>
                <div style={{
                  padding: '4px 20px', borderRadius: 8,
                  background: 'rgba(148,163,184,0.07)',
                  color: 'rgba(148,163,184,0.5)', fontSize: 12,
                  fontFamily: 'monospace',
                }}>
                  dosshield.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 460 }}>
              {/* Left panel */}
              <div style={{
                borderRight: '1px solid rgba(148,163,184,0.07)',
                padding: 24,
                background: 'rgba(8,14,30,0.4)',
              }}>
                {/* API Key */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>HF API Key</div>
                  <div style={{
                    padding: '9px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(20,184,166,0.2)',
                    fontSize: 11, fontFamily: 'monospace', color: '#14b8a6',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                    hf_••••••••••••••••
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Attack Module</div>
                  {tabs.map((t, i) => (
                    <div
                      key={t}
                      onClick={() => setActiveTab(i)}
                      style={{
                        padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                        background: activeTab === i ? 'rgba(20,184,166,0.1)' : 'transparent',
                        border: `1px solid ${activeTab === i ? 'rgba(20,184,166,0.25)' : 'transparent'}`,
                        color: activeTab === i ? '#14b8a6' : 'rgba(148,163,184,0.6)',
                        fontSize: 13, fontWeight: activeTab === i ? 600 : 400,
                        transition: 'all 0.2s',
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                {/* Config */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Target Model</div>
                  <div style={{
                    padding: '9px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.1)',
                    fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace',
                  }}>
                    Llama-3.1-8B-Instruct ▾
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Intensity</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Low', 'Med', 'High'].map((v, i) => (
                      <div key={v} style={{
                        flex: 1, padding: '6px', borderRadius: 7, textAlign: 'center', cursor: 'pointer',
                        background: i === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${i === 2 ? 'rgba(245,158,11,0.3)' : 'rgba(148,163,184,0.08)'}`,
                        color: i === 2 ? '#f59e0b' : 'rgba(148,163,184,0.5)',
                        fontSize: 11, fontWeight: i === 2 ? 700 : 400,
                      }}>{v}</div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '11px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: '#0a1628', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(20,184,166,0.3)',
                }}>
                  ⚡ Launch Attack
                </div>
              </div>

              {/* Right panel */}
              <div style={{ padding: 24 }}>
                {/* Metrics row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Requests Sent', value: '247', color: '#14b8a6' },
                    { label: 'Success Rate', value: '84%', color: '#34d399' },
                    { label: 'Avg Latency', value: '2.3s', color: '#f59e0b' },
                    { label: 'Errors', value: '39', color: '#f87171' },
                  ].map(m => (
                    <div key={m.label} style={{
                      padding: '14px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.07)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: 'monospace', marginBottom: 4 }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Fake chart */}
                <div style={{
                  padding: '16px 20px', borderRadius: 12, marginBottom: 20,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(148,163,184,0.07)',
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', fontWeight: 600, marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Token Usage Over Time
                  </div>
                  <svg width="100%" height="70" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      points="0,60 40,45 80,50 120,20 160,35 200,15 240,25 280,10 320,20 360,5 400,18"
                      fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(20,184,166,0.5))' }}
                    />
                    <polygon
                      points="0,60 40,45 80,50 120,20 160,35 200,15 240,25 280,10 320,20 360,5 400,18 400,70 0,70"
                      fill="url(#chartGrad)"
                    />
                  </svg>
                </div>

                {/* Recent logs */}
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.07)' }}>
                  <div style={{
                    padding: '10px 16px', background: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(148,163,184,0.07)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px',
                    fontSize: 10, fontWeight: 700, color: 'rgba(148,163,184,0.4)',
                    textTransform: 'uppercase', letterSpacing: '0.6px',
                  }}>
                    <span>Prompt</span><span>Model</span><span>Tokens</span><span>Status</span>
                  </div>
                  {[
                    { prompt: 'Recursive nested...', model: 'Llama-3.1-8B', tokens: '4,096', status: 'success' },
                    { prompt: 'Enumerate all...', model: 'Llama-3.1-8B', tokens: '3,850', status: 'timeout' },
                    { prompt: 'Repeat infinitely...', model: 'Llama-3.1-8B', tokens: '4,096', status: 'success' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      padding: '9px 16px', display: 'grid',
                      gridTemplateColumns: '1fr 1fr 80px 70px',
                      fontSize: 12, alignItems: 'center',
                      borderBottom: i < 2 ? '1px solid rgba(148,163,184,0.05)' : 'none',
                      color: 'rgba(148,163,184,0.7)',
                    }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.prompt}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{row.model}</span>
                      <span style={{ fontFamily: 'monospace', color: '#14b8a6', fontSize: 11 }}>{row.tokens}</span>
                      <span style={{
                        display: 'inline-flex', padding: '2px 8px', borderRadius: 10,
                        fontSize: 10, fontWeight: 700,
                        background: row.status === 'success' ? 'rgba(52,211,153,0.12)' : 'rgba(245,158,11,0.12)',
                        color: row.status === 'success' ? '#34d399' : '#f59e0b',
                        border: `1px solid ${row.status === 'success' ? 'rgba(52,211,153,0.25)' : 'rgba(245,158,11,0.25)'}`,
                      }}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUPPORTED MODELS
───────────────────────────────────────────── */
const models = [
  { name: 'Llama 3.1 8B',      abbr: 'L1', color: '#14b8a6', desc: 'Cerebras',         provider: 'cerebras' },
  { name: 'Llama 3.3 70B',     abbr: 'L3', color: '#8b5cf6', desc: 'Groq / SambaNova', provider: 'groq' },
  { name: 'Llama 4 Scout 17B', abbr: 'L4', color: '#f472b6', desc: 'Groq',              provider: 'groq' },
  { name: 'Qwen 2.5 72B',      abbr: 'Q2', color: '#f59e0b', desc: 'Novita',            provider: 'novita' },
  { name: 'Qwen 2.5 Coder 7B', abbr: 'QC', color: '#34d399', desc: 'nScale',            provider: 'nscale' },
  { name: 'Qwen3 32B',         abbr: 'Q3', color: '#14b8a6', desc: 'Groq',              provider: 'groq' },
  { name: 'DeepSeek R1',       abbr: 'DR', color: '#3b82f6', desc: 'SambaNova / Novita',provider: 'sambanova' },
  { name: 'DeepSeek V3.2',     abbr: 'DV', color: '#f59e0b', desc: 'Novita',            provider: 'novita' },
  { name: 'Gemma 3 27B',       abbr: 'G3', color: '#f472b6', desc: 'Scaleway',          provider: 'scaleway' },
];

function ModelsSection() {
  return (
    <section id="models" style={{ padding: '100px 32px', position: 'relative' }}>
      {/* Neural network SVG background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.15 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={`${(i * 20) + 5}%`} y1="20%"
              x2={`${(i * 14) + 15}%`} y2="80%"
              stroke="#14b8a6" strokeWidth="1"
              strokeDasharray="4 8"
            />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Supported Models" color="teal" />
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 850, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 14 }}>
              Test Any Major AI Model
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(148,163,184,0.75)', maxWidth: 440, margin: '0 auto' }}>
              Native support for the world's most-deployed open-source language models.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
          {models.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -5, boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px ${m.color}44` }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '22px 20px', borderRadius: 18, textAlign: 'center',
                  background: 'rgba(17,24,39,0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 50, height: 50, borderRadius: 14, margin: '0 auto 14px',
                  background: `${m.color}18`,
                  border: `1.5px solid ${m.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: m.color,
                  boxShadow: `0 0 16px ${m.color}22`,
                  fontFamily: 'monospace', letterSpacing: '-0.5px',
                }}>
                  {m.abbr}
                </div>

                {/* Name */}
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>{m.name}</div>

                {/* Provider badge */}
                <div style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 10,
                  background: `${m.color}14`, color: m.color,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.4px',
                  textTransform: 'capitalize', marginBottom: 10,
                  border: `1px solid ${m.color}28`,
                }}>
                  {m.provider}
                </div>

                {/* Animated dot */}
                <motion.div
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: m.color, margin: '0 auto',
                    boxShadow: `0 0 7px ${m.color}`,
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, delay: i * 0.25, repeat: Infinity }}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ANALYTICS SECTION
───────────────────────────────────────────── */
function AnalyticsSection() {
  const bars = [65, 82, 45, 91, 73, 88, 56, 94, 70, 83, 61, 97];
  const heat = [0.2, 0.5, 0.8, 0.3, 0.9, 0.6, 0.4, 0.7, 0.1, 0.8, 0.5, 0.95,
                0.4, 0.7, 0.3, 0.6, 0.2, 0.85, 0.7, 0.4, 0.9, 0.5, 0.3, 0.7];

  return (
    <section id="analytics" style={{ padding: '100px 32px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Security Analytics" color="amber" />
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 850, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 14 }}>
              Visualize Every Vulnerability
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(148,163,184,0.75)', maxWidth: 440, margin: '0 auto' }}>
              Rich analytics surfaced through clean, Stripe-inspired charts and dashboards.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Token consumption chart */}
          <Reveal delay={0}>
            <div style={{
              padding: '28px', borderRadius: 20,
              background: 'rgba(17,24,39,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(148,163,184,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Token Consumption</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#14b8a6', fontFamily: 'monospace' }}>4.2M</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>tokens processed this week</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                    style={{
                      flex: 1, borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(180deg, #14b8a6, #0d9488)`,
                      opacity: 0.5 + (h / 200),
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Vulnerability heatmap */}
          <Reveal delay={0.1}>
            <div style={{
              padding: '28px', borderRadius: 20,
              background: 'rgba(17,24,39,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(148,163,184,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Vulnerability Heatmap</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>12</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>critical vulnerabilities found</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3 }}>
                {heat.map((v, i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 4,
                    background: v > 0.75
                      ? '#f59e0b'
                      : v > 0.5
                      ? '#f59e0b88'
                      : v > 0.25
                      ? '#f59e0b44'
                      : '#f59e0b18',
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Attack success metrics */}
          <Reveal delay={0.2}>
            <div style={{
              padding: '28px', borderRadius: 20,
              background: 'rgba(17,24,39,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(148,163,184,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Attack Success Rate</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#8b5cf6', fontFamily: 'monospace' }}>78.4%</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>across all attack types</div>
              </div>
              {[
                { label: 'Prompt Flood', val: 84, color: '#14b8a6' },
                { label: 'Token Exhaustion', val: 91, color: '#8b5cf6' },
                { label: 'Batch Attack', val: 73, color: '#f59e0b' },
                { label: 'Model Exploit', val: 65, color: '#f472b6' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.7)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Latency chart */}
          <Reveal delay={0.3}>
            <div style={{
              padding: '28px', borderRadius: 20,
              background: 'rgba(17,24,39,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(148,163,184,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Response Latency</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f472b6', fontFamily: 'monospace' }}>2.3s</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>avg under attack conditions</div>
              </div>
              <svg width="100%" height="90">
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points="0,70 30,55 60,65 90,30 120,50 150,20 180,40 210,15 240,35 270,10 300,28"
                  fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(244,114,182,0.5))' }}
                />
                <polygon
                  points="0,70 30,55 60,65 90,30 120,50 150,20 180,40 210,15 240,35 270,10 300,28 300,90 0,90"
                  fill="url(#latencyGrad)"
                />
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS SECTION
───────────────────────────────────────────── */
const codeSnippet = `// 1. Select your attacker + target model
attacker: "meta-llama/Llama-4-Scout-17B"
target:   "meta-llama/Llama-3.1-8B-Instruct"

// 2. DOS Shield generates unique attack prompts
{
  "prompt": "Analyze 'evolutionary game theory' using
   a 6-level nested framework. At each level provide:
   (a) historical account with 73 key events,
   (b) mathematical model with 58 variables,
   (c) cross-reference against 5 other domains..."
}

// 3. Attack prompt is sent to target model
POST router.huggingface.co/v1/chat/completions
{
  "model": "meta-llama/Llama-3.1-8B-Instruct",
  "messages": [{ "role": "user", "content": "..." }],
  "max_tokens": 512
}

// 4. Response + metrics recorded live
{
  "response_time_ms": 2133,
  "tokens_used": 512,
  "status": "success"
}`;

function DeveloperSection() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = codeSnippet.split('\n');

  return (
    <section id="api" style={{ padding: '100px 32px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <Reveal direction="left">
            <div>
              <SectionLabel text="How It Works" color="purple" />
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 850, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 20 }}>
                Attacker vs Target,<br />Model vs Model.
              </h2>
              <p style={{ fontSize: 16.5, color: 'rgba(148,163,184,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
                DOS Shield uses one AI model to <strong style={{ color: '#f8fafc' }}>generate</strong> adversarial attack prompts,
                then fires them at a second <strong style={{ color: '#f8fafc' }}>target</strong> model — measuring how it degrades under load.
                All powered by the HuggingFace Router API.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🤖', text: 'Attacker model generates unique prompts dynamically — never the same twice' },
                  { icon: '🎯', text: 'Target model receives the attacks and responses are captured in real time' },
                  { icon: '📊', text: 'Metrics tracked: latency, token usage, error rate, success rate' },
                  { icon: '📄', text: 'Download a full PDF report with every prompt and response included' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 18, marginTop: 1 }}>{item.icon}</span>
                    <span style={{ fontSize: 14.5, color: 'rgba(148,163,184,0.8)', lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36 }}>
                <Link to="/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 26px', borderRadius: 10,
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                  color: '#8b5cf6', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.25)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Open Dashboard →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div style={{ position: 'relative' }}>
              {/* Code block */}
              <div style={{
                borderRadius: 18, overflow: 'hidden',
                background: '#0d1117',
                border: '1px solid rgba(148,163,184,0.1)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}>
                {/* Code header */}
                <div style={{
                  padding: '12px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(148,163,184,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', gap: 7 }}>
                    {['#ff5f56', '#febc2e', '#28c840'].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', fontFamily: 'monospace' }}>POST /api/test/dos</span>
                  <button
                    onClick={handleCopy}
                    style={{
                      padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)',
                      color: copied ? '#34d399' : 'rgba(148,163,184,0.6)',
                      fontSize: 11, fontWeight: 600, transition: 'all 0.2s',
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                {/* Code content */}
                <div style={{ padding: '20px 24px', fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: 12.5, lineHeight: 1.75, overflowX: 'auto' }}>
                  {lines.map((line, i) => {
                    let color = '#e2e8f0';
                    if (line.startsWith('POST') || line.startsWith('Authorization') || line.startsWith('Content')) color = '#7dd3fc';
                    if (line.includes('"') && line.includes(':') && !line.startsWith('//')) {
                      const parts = line.split(':');
                      return (
                        <div key={i}>
                          <span style={{ color: '#c084fc' }}>{parts[0]}</span>
                          <span style={{ color: '#6b7280' }}>:</span>
                          <span style={{ color: '#86efac' }}>{parts.slice(1).join(':')}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('//')) color = '#6b7280';
                    if (line.trim() === '{' || line.trim() === '}') color = '#94a3b8';
                    return <div key={i} style={{ color }}>{line || <br />}</div>;
                  })}
                </div>
              </div>

              {/* Floating glow */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300, height: 300,
                background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: -1,
              }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────────── */
function CTASection() {
  return (
    <section style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow effects */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(20,184,166,0.08) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{
            display: 'inline-flex', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)',
            color: '#14b8a6', fontSize: 11, fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', marginBottom: 28,
          }}>
            Get Started Today
          </div>

          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900,
            color: '#f8fafc', letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Secure Your AI<br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Infrastructure Today.</span>
          </h2>

          <p style={{ fontSize: 17.5, color: 'rgba(148,163,184,0.8)', lineHeight: 1.65, marginBottom: 44, maxWidth: 480, margin: '0 auto 44px' }}>
            Join security teams worldwide who trust DOS Shield to harden their AI systems before attackers exploit them.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 14,
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: '#0a1628', fontSize: 16, fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 40px rgba(20,184,166,0.4)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(20,184,166,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(20,184,166,0.4)'; }}
            >
              Start Free Testing →
            </Link>
            <a href="#api" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(148,163,184,0.15)',
              color: '#e2e8f0', fontSize: 16, fontWeight: 600,
              textDecoration: 'none', backdropFilter: 'blur(12px)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              Read Docs
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(148,163,184,0.07)',
      padding: '48px 32px',
      background: 'rgba(8,14,30,0.5)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, color: 'white',
            }}>◆</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>DOS Shield</span>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Models', 'Analytics', 'How It Works', 'Dashboard'].map(item => (
              <a key={item} href={item === 'Dashboard' ? '/dashboard' : item === 'How It Works' ? '#api' : `#${item.toLowerCase()}`} style={{ fontSize: 13, color: 'rgba(148,163,184,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.55)')}
              >{item}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.35)' }}>
            © 2025 DOS Shield. Built for AI security.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   LANDING PAGE EXPORT
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1a2540 50%, #0f172a 100%)',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <ModelsSection />
      <AnalyticsSection />
      <DeveloperSection />
      <CTASection />
      <Footer />
    </div>
  );
}