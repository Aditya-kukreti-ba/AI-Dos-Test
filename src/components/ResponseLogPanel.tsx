import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResponseLog } from '../types';

interface ResponseLogPanelProps {
  responses: ResponseLog[];
}

function LogEntry({ r, i }: { r: ResponseLog; i: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="log-entry"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header row */}
      <div className="log-meta" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`status-badge ${r.status}`}>{r.status}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
            {r.responseTime.toFixed(0)}ms · {r.tokensUsed} tokens
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          {expanded ? '▲ collapse' : '▼ expand'}
        </span>
      </div>

      {/* Attack prompt (always visible, truncated) */}
      <div style={{ marginTop: 6 }}>
        <div style={{ fontSize: '10px', color: 'var(--accent-teal)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 3 }}>
          ▶ Attack Prompt
        </div>
        <div className="log-prompt">
          {expanded ? r.prompt : r.prompt.slice(0, 120) + (r.prompt.length > 120 ? '...' : '')}
        </div>
      </div>

      {/* Target model response — shown when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {r.error ? (
              <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--accent-red)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 3 }}>
                  ✕ Error
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent-red)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {r.error}
                </div>
              </div>
            ) : r.response ? (
              <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 6, background: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.15)' }}>
                <div style={{ fontSize: '10px', color: 'var(--accent-purple)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                  ◀ Target Model Response
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}>
                  {r.response}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 8, fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                No response body recorded.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResponseLogPanel({ responses }: ResponseLogPanelProps) {
  if (responses.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Response Log
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Click any entry to see full prompt + model output
        </span>
      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {responses.map((r, i) => (
          <LogEntry key={i} r={r} i={i} />
        ))}
      </div>
    </div>
  );
}
