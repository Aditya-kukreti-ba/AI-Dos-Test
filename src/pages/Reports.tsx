import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TestResult } from '../types';
import { generateReport, generateComparisonReport } from '../services/reportGenerator';

const ATTACK_LABELS: Record<string, string> = {
  'prompt-flood': '🌊 Prompt Flood',
  'token-exhaustion': '🔥 Token Exhaustion',
  'batch-attack': '⚡ Batch Attack',
  'model-exploit': '🎯 Model Exploit',
};

export default function Reports() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dos_test_results') || '[]');
    setResults(stored);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownloadSingle = (result: TestResult) => {
    generateReport(result);
  };

  const handleDownloadComparison = () => {
    const selectedResults = results.filter(r => selected.has(r.id));
    if (selectedResults.length > 0) {
      generateComparisonReport(selectedResults);
    }
  };

  const handleClearResults = () => {
    localStorage.removeItem('dos_test_results');
    setResults([]);
    setSelected(new Set());
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>📊 Test Reports</h1>
        <p>View, compare, and download detailed reports from your DOS security tests</p>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          className="btn btn-primary"
          onClick={handleDownloadComparison}
          disabled={selected.size < 2}
        >
          📥 Download Comparison ({selected.size} selected)
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selected.size === results.length) setSelected(new Set());
            else setSelected(new Set(results.map(r => r.id)));
          }}
        >
          {selected.size === results.length ? 'Deselect All' : 'Select All'}
        </button>
        <div style={{ flex: 1 }} />
        {results.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleClearResults}>
            🗑 Clear All
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '16px', marginBottom: '8px' }}>
            No test results yet
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
            Run an attack from any dashboard to see results here
          </div>
        </div>
      ) : (
        <div className="glass-card">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>✓</th>
                <th>Attack Type</th>
                <th>Mode</th>
                <th>Target Model</th>
                <th>Attacker Model</th>
                <th>Requests</th>
                <th>Error Rate</th>
                <th>Avg Time</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.slice().reverse().map((r, i) => {
                const errorRate = ((r.metrics.failedRequests / Math.max(r.metrics.totalRequests, 1)) * 100);
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      background: selected.has(r.id) ? 'var(--accent-teal-dim)' : 'transparent',
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent-teal)' }}
                      />
                    </td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>
                      {ATTACK_LABELS[r.attackType] || r.attackType}
                    </td>
                    <td>
                      <span className={`status-badge ${r.mode === 'auto' ? 'running' : 'success'}`}>
                        {r.mode === 'auto' ? '🤖' : '✍️'} {r.mode}
                      </span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
                      {r.targetModel}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text-dim)' }}>
                      {r.attackerModel || '—'}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {r.metrics.completedRequests}/{r.metrics.totalRequests}
                    </td>
                    <td>
                      <span style={{ color: errorRate > 50 ? 'var(--accent-red)' : errorRate > 20 ? 'var(--accent-amber)' : 'var(--accent-green)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {errorRate.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                      {r.metrics.avgResponseTime.toFixed(0)}ms
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDownloadSingle(r)}
                      >
                        📥 PDF
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
