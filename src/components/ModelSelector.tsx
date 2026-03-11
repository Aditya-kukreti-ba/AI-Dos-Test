import { useState, useEffect } from 'react';
import { fetchModels } from '../services/huggingface';
import type { ModelInfo } from '../types';

interface ModelSelectorProps {
  label: string;
  value: string;
  onChange: (modelId: string) => void;
}

const providerColors: Record<string, { bg: string; color: string }> = {
  cerebras:  { bg: 'rgba(20,184,166,0.12)',   color: '#14b8a6' },
  groq:      { bg: 'rgba(139,92,246,0.12)',   color: '#8b5cf6' },
  novita:    { bg: 'rgba(245,158,11,0.12)',   color: '#f59e0b' },
  nscale:    { bg: 'rgba(244,114,182,0.12)',  color: '#f472b6' },
  sambanova: { bg: 'rgba(59,130,246,0.12)',   color: '#3b82f6' },
  scaleway:  { bg: 'rgba(52,211,153,0.12)',   color: '#34d399' },
};

function ProviderBadge({ provider }: { provider?: string }) {
  if (!provider) return null;
  const style = providerColors[provider] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 8,
      background: style.bg, color: style.color,
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.4px', textTransform: 'capitalize',
      flexShrink: 0,
    }}>
      {provider}
    </span>
  );
}

export default function ModelSelector({ label, value, onChange }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModels(search).then(setModels);
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const selectedModel = models.find((m) => m.id === value);

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label>{label}</label>
      <div
        className="form-input"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ opacity: value ? 1 : 0.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
          {selectedModel?.name || value || 'Select a model...'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {selectedModel?.provider && <ProviderBadge provider={selectedModel.provider} />}
          <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
          marginTop: '4px',
          background: 'rgba(10, 14, 26, 0.97)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{ fontSize: '13px' }}
            />
          </div>
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {models.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                No models found
              </div>
            ) : (
              models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    onChange(model.id);
                    setOpen(false);
                    setSearch('');
                  }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: model.id === value ? 'var(--accent-teal-dim)' : 'transparent',
                    transition: 'background 0.15s',
                    borderBottom: '1px solid rgba(148,163,184,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (model.id !== value) e.currentTarget.style.background = 'rgba(45,212,191,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (model.id !== value) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500,
                      color: model.id === value ? 'var(--accent-teal)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {model.name}
                    </div>
                    <div style={{
                      fontSize: 10.5, color: 'var(--text-dim)',
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginTop: 2,
                    }}>
                      {model.id}
                    </div>
                  </div>
                  <ProviderBadge provider={model.provider} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}