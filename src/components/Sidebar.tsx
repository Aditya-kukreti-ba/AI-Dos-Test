import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: '⬡' },
  { path: '/dashboard/prompt-flood', label: 'Prompt Flood', icon: '🌊' },
  { path: '/dashboard/token-exhaustion', label: 'Token Exhaust', icon: '🔥' },
  { path: '/dashboard/batch-attack', label: 'Batch Attack', icon: '⚡' },
  { path: '/dashboard/model-exploit', label: 'Model Exploit', icon: '🎯' },
  { path: '/dashboard/reports', label: 'Reports', icon: '📊' },
];

export default function Sidebar() {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <span className="logo-icon">◆</span>
          <span className="logo-text">DOS Shield</span>
        </NavLink>
        <div className="sidebar-subtitle">AI Security Testing</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: rgba(10, 14, 26, 0.92);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--border-glass);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .logo-icon {
          font-size: 22px;
          color: var(--accent-teal);
          filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.4));
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-teal), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-subtitle {
          font-size: 11px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding-left: 32px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 450;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(45, 212, 191, 0.06);
        }

        .nav-item.active {
          color: var(--accent-teal);
          background: var(--accent-teal-dim);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent-teal);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 10px rgba(45, 212, 191, 0.5);
        }

        .nav-icon {
          font-size: 16px;
          width: 22px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-glass);
        }

        .sidebar-version {
          font-size: 11px;
          color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60px;
          }
          .nav-label, .logo-text, .sidebar-subtitle, .sidebar-version {
            display: none;
          }
          .sidebar-header {
            padding: 16px 12px;
            text-align: center;
          }
          .sidebar-logo {
            justify-content: center;
          }
          .nav-item {
            justify-content: center;
            padding: 12px;
          }
          .nav-icon {
            width: auto;
          }
        }
      `}</style>
    </motion.aside>
  );
}