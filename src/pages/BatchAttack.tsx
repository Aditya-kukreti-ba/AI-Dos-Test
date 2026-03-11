import AttackConfig from '../components/AttackConfig';
import MetricsPanel from '../components/MetricsPanel';
import ResponseLogPanel from '../components/ResponseLogPanel';
import { useAttackRunner } from '../hooks/useAttackRunner';

export default function BatchAttack() {
  const runner = useAttackRunner('batch-attack');

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>⚡ Batch Attack</h1>
        <p>Send large bursts of concurrent requests to stress-test API throughput</p>
      </div>

      <div className="dashboard-layout">
        <AttackConfig
          {...runner}
          onRun={runner.runAttack}
          onStop={runner.stopAttack}
          showBatchSize
          description="Sends large concurrent request batches to stress-test the target's ability to handle simultaneous queries. Configure batch size and total request count to simulate realistic attack scenarios."
          manualPlaceholder="Enter prompts for batch sending...\n\nExample: What is the meaning of life? Explain in full detail.\n\nSeparate multiple prompts with ---"
        />

        <div className="results-panel">
          <MetricsPanel metrics={runner.metrics} isRunning={runner.isRunning} />
          <ResponseLogPanel responses={runner.responses} />
        </div>
      </div>
    </div>
  );
}