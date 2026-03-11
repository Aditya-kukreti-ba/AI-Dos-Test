import AttackConfig from '../components/AttackConfig';
import MetricsPanel from '../components/MetricsPanel';
import ResponseLogPanel from '../components/ResponseLogPanel';
import { useAttackRunner } from '../hooks/useAttackRunner';

export default function TokenExhaustion() {
  const runner = useAttackRunner('token-exhaustion');

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>🔥 Token Exhaustion</h1>
        <p>Maximize token consumption to exhaust model quotas and compute resources</p>
      </div>

      <div className="dashboard-layout">
        <AttackConfig
          {...runner}
          onRun={runner.runAttack}
          onStop={runner.stopAttack}
          description="Sends prompts designed to maximize output length and token consumption. Tests how the model handles requests for extremely verbose responses and whether rate limiting kicks in."
          manualPlaceholder="Enter prompts that request maximum-length outputs...\n\nExample: Write the most comprehensive essay possible about the entire history of human civilization. Do not summarize. Include every detail.\n\nSeparate multiple prompts with ---"
        />

        <div className="results-panel">
          <MetricsPanel metrics={runner.metrics} isRunning={runner.isRunning} />
          <ResponseLogPanel responses={runner.responses} />
        </div>
      </div>
    </div>
  );
}