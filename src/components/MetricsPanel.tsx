import { motion } from 'framer-motion';
import type { AttackMetrics } from '../types';

interface MetricsPanelProps {
  metrics: AttackMetrics | null;
  isRunning: boolean;
}

export default function MetricsPanel({ metrics, isRunning }: MetricsPanelProps) {
  if (!metrics) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📊</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
          Run an attack to see live metrics here
        </div>
      </div>
    );
  }

  const progress = metrics.totalRequests > 0
    ? ((metrics.completedRequests + metrics.failedRequests + metrics.timedOutRequests) / metrics.totalRequests) * 100
    : 0;

  const errorRate = metrics.totalRequests > 0
    ? ((metrics.failedRequests / Math.max(metrics.completedRequests + metrics.failedRequests + metrics.timedOutRequests, 1)) * 100)
    : 0;

  const cards = [
    { label: 'Completed', value: metrics.completedRequests, color: 'text-teal' },
    { label: 'Failed', value: metrics.failedRequests, color: 'text-red' },
    { label: 'Timed Out', value: metrics.timedOutRequests, color: 'text-amber' },
    { label: 'Avg Time', value: `${metrics.avgResponseTime.toFixed(0)}ms`, color: 'text-purple' },
    { label: 'Max Time', value: `${metrics.maxResponseTime.toFixed(0)}ms`, color: 'text-pink' },
    { label: 'Tokens Used', value: metrics.totalTokensUsed, color: 'text-teal' },
    { label: 'Avg Tokens', value: metrics.avgTokensPerRequest.toFixed(1), color: 'text-purple' },
    { label: 'Error Rate', value: `${errorRate.toFixed(1)}%`, color: errorRate > 50 ? 'text-red' : 'text-green' },
  ];

  return (
    <div className="animate-in">
      {/* Progress */}
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Progress
          </span>
          <span className={`status-badge ${isRunning ? 'running' : 'success'}`}>
            {isRunning ? '● Running' : '✓ Complete'}
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'right' }}>
          {metrics.completedRequests + metrics.failedRequests + metrics.timedOutRequests} / {metrics.totalRequests}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '16px' }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card metric-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`metric-value ${card.color}`}>{card.value}</div>
            <div className="metric-label">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Response Time Bars */}
      {metrics.responseTimes.length > 0 && (
        <div className="glass-card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Response Times
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px' }}>
            {metrics.responseTimes.slice(-40).map((time, i) => {
              const maxTime = Math.max(...metrics.responseTimes, 1);
              const height = Math.max((time / maxTime) * 100, 3);
              const color = time > maxTime * 0.7 ? 'var(--accent-red)' :
                time > maxTime * 0.4 ? 'var(--accent-amber)' : 'var(--accent-teal)';
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  style={{
                    flex: 1,
                    background: color,
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.7,
                    minWidth: '4px',
                  }}
                  title={`${time.toFixed(0)}ms`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Recent requests →</span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Max: {metrics.maxResponseTime.toFixed(0)}ms</span>
          </div>
        </div>
      )}
    </div>
  );
}
