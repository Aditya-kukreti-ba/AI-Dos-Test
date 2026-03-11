import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApiKey, setApiKey } from '../services/huggingface';
import type { TestResult } from '../types';

const attackCards = [
  {
    path: '/dashboard/prompt-flood',
    icon: '🌊',
    title: 'Complex Prompt Flood',
    desc: 'Overwhelm targets with deeply nested, recursive, and complex prompts',
    color: 'var(--accent-teal)',
    bg: 'var(--accent-teal-dim)',
  },
  {
    path: '/dashboard/token-exhaustion',
    icon: '🔥',
    title: 'Token Exhaustion',
    desc: 'Maximize token consumption to exhaust model quotas and resources',
    color: 'var(--accent-purple)',
    bg: 'var(--accent-purple-dim)',
  },
  {
    path: '/dashboard/batch-attack',
    icon: '⚡',
    title: 'Batch Attack',
    desc: 'Send concurrent request bursts to stress-test API throughput',
    color: 'var(--accent-amber)',
    bg: 'var(--accent-amber-dim)',
  },
  {
    path: '/dashboard/model-exploit',
    icon: '🎯',
    title: 'Model-Specific Exploit',
    desc: 'Target architecture-specific vulnerabilities and edge cases',
    color: 'var(--accent-pink)',
    bg: 'var(--accent-pink-dim)',
  },
];

export default function Home() {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [results, setResults] = useState<TestResult[]>([]);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dos_test_results') || '[]');
    setResults(stored);
  }, []);

  const handleApiKeySave = (key: string) => {
    setApiKeyState(key);
    setApiKey(key);
  };

  const recentResults = results.slice(-4).reverse();

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>DOS Security Dashboard</h1>
        <p>Test AI/LLM models against Denial of Service attack vectors using Hugging Face models</p>
      </div>

      {/* API Key Input */}
      <div className="api-key-bar">
        <span className="key-label">🔑 HF API Key</span>
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => handleApiKeySave(e.target.value)}
          placeholder="Enter your Hugging Face API key..."
        />
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? '🙈' : '👁️'}
        </button>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: apiKey ? 'var(--accent-green)' : 'var(--accent-red)',
          boxShadow: apiKey ? '0 0 8px var(--accent-green)' : '0 0 8px var(--accent-red)',
        }} />
      </div>

      {/* Attack Cards */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {attackCards.map((card, i) => (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={card.path} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: card.color }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {card.desc}
                    </div>
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                }}>
                  Launch →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Recent Tests
            </h3>
            <Link to="/dashboard/reports" className="btn btn-sm btn-secondary">
              View All →
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Attack Type</th>
                <th>Target</th>
                <th>Mode</th>
                <th>Success Rate</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--accent-teal)' }}>
                    {attackCards.find(c => c.path === `/dashboard/${r.attackType}`)?.title || r.attackType}
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                    {r.targetModel}
                  </td>
                  <td>
                    <span className={`status-badge ${r.mode === 'auto' ? 'running' : 'success'}`}>
                      {r.mode === 'auto' ? '🤖 Auto' : '✍️ Manual'}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {((r.metrics.completedRequests / Math.max(r.metrics.totalRequests, 1)) * 100).toFixed(0)}%
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}