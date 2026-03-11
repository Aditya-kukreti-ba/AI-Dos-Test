import { useState, useCallback, useRef } from 'react';
import type { AttackMetrics, AttackMode, ResponseLog, TestResult } from '../types';
import { queryModel, generateAttackPrompts, getApiKey } from '../services/huggingface';

export function useAttackRunner(attackType: TestResult['attackType']) {
  const [mode, setMode] = useState<AttackMode>('auto');
  const [targetModel, setTargetModel] = useState('');
  const [attackerModel, setAttackerModel] = useState('');
  const [manualPrompts, setManualPrompts] = useState('');
  const [requestCount, setRequestCount] = useState(5);
  const [batchSize, setBatchSize] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [metrics, setMetrics] = useState<AttackMetrics | null>(null);
  const [responses, setResponses] = useState<ResponseLog[]>([]);
  const abortRef = useRef(false);

  const initMetrics = useCallback((total: number): AttackMetrics => ({
    totalRequests: total,
    completedRequests: 0,
    failedRequests: 0,
    timedOutRequests: 0,
    avgResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Infinity,
    totalTokensUsed: 0,
    avgTokensPerRequest: 0,
    responseTimes: [],
    errors: [],
    startTime: Date.now(),
  }), []);

  const updateMetrics = useCallback((prev: AttackMetrics, log: ResponseLog): AttackMetrics => {
    const times = [...prev.responseTimes, log.responseTime];
    const completed = log.status === 'success' ? prev.completedRequests + 1 : prev.completedRequests;
    const failed = log.status === 'error' ? prev.failedRequests + 1 : prev.failedRequests;
    const timedOut = log.status === 'timeout' ? prev.timedOutRequests + 1 : prev.timedOutRequests;
    const totalTokens = prev.totalTokensUsed + log.tokensUsed;
    const totalDone = completed + failed + timedOut;

    return {
      ...prev,
      completedRequests: completed,
      failedRequests: failed,
      timedOutRequests: timedOut,
      avgResponseTime: times.reduce((a, b) => a + b, 0) / times.length,
      maxResponseTime: Math.max(prev.maxResponseTime, log.responseTime),
      minResponseTime: Math.min(prev.minResponseTime, log.responseTime),
      totalTokensUsed: totalTokens,
      avgTokensPerRequest: totalDone > 0 ? totalTokens / totalDone : 0,
      responseTimes: times,
      errors: log.error ? [...prev.errors, log.error] : prev.errors,
      startTime: prev.startTime,
    };
  }, []);

  const runAttack = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey || !targetModel) return;

    abortRef.current = false;
    setIsRunning(true);
    setResponses([]);

    let prompts: string[] = [];

    if (mode === 'auto') {
      if (!attackerModel) return;
      setIsGenerating(true);
      prompts = await generateAttackPrompts(attackerModel, attackType, apiKey, requestCount);
      setIsGenerating(false);
    } else {
      prompts = manualPrompts
        .split('\n---\n')
        .map(p => p.trim())
        .filter(Boolean);
      if (prompts.length === 0) {
        prompts = [manualPrompts.trim()];
      }
    }

    const totalReqs = mode === 'auto' ? prompts.length : requestCount;
    let currentMetrics = initMetrics(totalReqs);
    setMetrics(currentMetrics);

    if (attackType === 'batch-attack') {
      // Send in batches
      for (let batch = 0; batch < Math.ceil(totalReqs / batchSize); batch++) {
        if (abortRef.current) break;
        const batchPromises: Promise<ResponseLog>[] = [];
        for (let j = 0; j < batchSize && batch * batchSize + j < totalReqs; j++) {
          const promptIdx = (batch * batchSize + j) % prompts.length;
          batchPromises.push(queryModel(targetModel, prompts[promptIdx], apiKey));
        }
        const results = await Promise.all(batchPromises);
        for (const log of results) {
          if (abortRef.current) break;
          currentMetrics = updateMetrics(currentMetrics, log);
          setMetrics({ ...currentMetrics });
          setResponses(prev => [...prev, log]);
        }
      }
    } else {
      // Sequential
      for (let i = 0; i < totalReqs; i++) {
        if (abortRef.current) break;
        const promptIdx = i % prompts.length;
        const log = await queryModel(targetModel, prompts[promptIdx], apiKey);
        currentMetrics = updateMetrics(currentMetrics, log);
        setMetrics({ ...currentMetrics });
        setResponses(prev => [...prev, log]);
      }
    }

    currentMetrics.endTime = Date.now();
    if (currentMetrics.minResponseTime === Infinity) currentMetrics.minResponseTime = 0;
    setMetrics({ ...currentMetrics });
    setIsRunning(false);

    // Save result
    const result: TestResult = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      attackType,
      mode,
      targetModel,
      attackerModel: mode === 'auto' ? attackerModel : undefined,
      config: {
        attackType,
        mode,
        targetModel,
        attackerModel: mode === 'auto' ? attackerModel : undefined,
        prompts,
        requestCount: totalReqs,
        batchSize,
      },
      metrics: currentMetrics,
      prompts,
      responses: [...responses],
    };

    const stored = JSON.parse(localStorage.getItem('dos_test_results') || '[]');
    stored.push(result);
    localStorage.setItem('dos_test_results', JSON.stringify(stored));

    return result;
  }, [mode, targetModel, attackerModel, manualPrompts, requestCount, batchSize, attackType, initMetrics, updateMetrics, responses]);

  const stopAttack = useCallback(() => {
    abortRef.current = true;
  }, []);

  return {
    mode, setMode,
    targetModel, setTargetModel,
    attackerModel, setAttackerModel,
    manualPrompts, setManualPrompts,
    requestCount, setRequestCount,
    batchSize, setBatchSize,
    isRunning, isGenerating,
    metrics, responses,
    runAttack, stopAttack,
  };
}
