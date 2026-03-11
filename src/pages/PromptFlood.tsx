import AttackConfig from '../components/AttackConfig';
import MetricsPanel from '../components/MetricsPanel';
import ResponseLogPanel from '../components/ResponseLogPanel';
import { useAttackRunner } from '../hooks/useAttackRunner';

export default function PromptFlood() {
  const runner = useAttackRunner('prompt-flood');

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>🌊 Complex Prompt Flood</h1>
        <p>Send extremely long, nested, and complex prompts to overwhelm the target model</p>
      </div>

      <div className="dashboard-layout">
        <AttackConfig
          {...runner}
          onRun={runner.runAttack}
          onStop={runner.stopAttack}
          description="Generates deeply nested, recursive prompts with convoluted logic to test how the target handles extreme complexity. In auto mode, the attacker model creates adversarial prompts."
          manualPlaceholder="Enter a complex, nested prompt to flood the target...\n\nExample: Please analyze the following nested structure and for each level provide a detailed breakdown: Level 1 contains sub-levels A through Z...\n\nSeparate multiple prompts with ---"
        />

        <div className="results-panel">
          <MetricsPanel metrics={runner.metrics} isRunning={runner.isRunning} />
          <ResponseLogPanel responses={runner.responses} />
        </div>
      </div>
    </div>
  );
}