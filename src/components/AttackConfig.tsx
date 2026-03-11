import { motion } from 'framer-motion';
import ModelSelector from './ModelSelector';
import type { AttackMode } from '../types';
import { getApiKey } from '../services/huggingface';

interface AttackConfigProps {
  mode: AttackMode;
  setMode: (mode: AttackMode) => void;
  targetModel: string;
  setTargetModel: (id: string) => void;
  attackerModel: string;
  setAttackerModel: (id: string) => void;
  manualPrompts: string;
  setManualPrompts: (v: string) => void;
  requestCount: number;
  setRequestCount: (n: number) => void;
  batchSize?: number;
  setBatchSize?: (n: number) => void;
  showBatchSize?: boolean;
  isRunning: boolean;
  isGenerating: boolean;
  onRun: () => void;
  onStop: () => void;
  description: string;
  manualPlaceholder?: string;
}

export default function AttackConfig({
  mode, setMode,
  targetModel, setTargetModel,
  attackerModel, setAttackerModel,
  manualPrompts, setManualPrompts,
  requestCount, setRequestCount,
  batchSize, setBatchSize,
  showBatchSize,
  isRunning, isGenerating,
  onRun, onStop,
  description,
  manualPlaceholder,
}: AttackConfigProps) {
  const hasApiKey = !!getApiKey();
  const canRun = hasApiKey && targetModel && (mode === 'manual' || attackerModel);

  return (
    <div className="glass-card config-panel">
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
        {description}
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={mode === 'auto' ? 'active' : ''}
          onClick={() => setMode('auto')}
        >
          🤖 Auto-Attack
        </button>
        <button
          className={mode === 'manual' ? 'active' : ''}
          onClick={() => setMode('manual')}
        >
          ✍️ Manual
        </button>
      </div>

      {/* Target Model */}
      <ModelSelector
        label="Target Model"
        value={targetModel}
        onChange={setTargetModel}
      />

      {/* Auto mode: attacker model */}
      {mode === 'auto' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ModelSelector
            label="Attacker Model"
            value={attackerModel}
            onChange={setAttackerModel}
          />
        </motion.div>
      )}

      {/* Manual mode: prompt input */}
      {mode === 'manual' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="form-group">
            <label>Attack Prompts</label>
            <textarea
              className="form-textarea"
              value={manualPrompts}
              onChange={(e) => setManualPrompts(e.target.value)}
              placeholder={manualPlaceholder || 'Enter your attack prompts here...\nSeparate multiple prompts with ---'}
              rows={5}
            />
          </div>
        </motion.div>
      )}

      {/* Request Count */}
      <div className="form-group">
        <label>Number of Requests</label>
        <input
          type="number"
          className="form-input"
          value={requestCount}
          onChange={(e) => setRequestCount(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          max={100}
        />
      </div>

      {/* Batch size (for batch attack) */}
      {showBatchSize && setBatchSize && (
        <div className="form-group">
          <label>Batch Size (concurrent)</label>
          <input
            type="number"
            className="form-input"
            value={batchSize}
            onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={20}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        {!isRunning ? (
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onRun}
            disabled={!canRun}
          >
            {!hasApiKey ? '🔑 Set API Key First' : '▶ Launch Attack'}
          </button>
        ) : (
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={onStop}
          >
            ⏹ Stop Attack
          </button>
        )}
      </div>

      {isGenerating && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'var(--accent-purple-dim)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          color: 'var(--accent-purple)',
          textAlign: 'center',
        }}>
          🤖 Generating adversarial prompts using attacker model...
        </div>
      )}
    </div>
  );
}
