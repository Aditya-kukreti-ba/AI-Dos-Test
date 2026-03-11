import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TestResult } from '../types';

const ATTACK_LABELS: Record<string, string> = {
  'prompt-flood': 'Complex Prompt Flood',
  'token-exhaustion': 'Token Exhaustion',
  'batch-attack': 'Batch Attack',
  'model-exploit': 'Model-Specific Exploit',
};

// ─── Dark theme palette ─────────────────────────────────────────────────────
const C = {
  bg:        [8,  14,  30] as [number,number,number],   // page background
  surface:   [13, 20,  40] as [number,number,number],   // card / table bg
  surface2:  [18, 27,  52] as [number,number,number],   // alternate row
  border:    [30, 50,  80] as [number,number,number],   // dividers
  teal:      [45, 212, 191] as [number,number,number],
  purple:    [167,139, 250] as [number,number,number],
  pink:      [244,114, 182] as [number,number,number],
  amber:     [251,191,  36] as [number,number,number],
  red:       [248,113, 113] as [number,number,number],
  green:     [52, 211, 153] as [number,number,number],
  textPrimary:   [226,232,240] as [number,number,number],
  textMuted:     [148,163,184] as [number,number,number],
  textDim:       [100,116,139] as [number,number,number],
};

function fillPage(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, w, h, 'F');
}

function sectionHeading(doc: jsPDF, text: string, y: number, color = C.teal) {
  doc.setFontSize(13);
  doc.setTextColor(...color);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 20, y);
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, doc.internal.pageSize.getWidth() - 20, y + 2);
  doc.setFont('helvetica', 'normal');
}

function getLastY(doc: jsPDF): number {
  return (doc as unknown as Record<string, Record<string, number>>).lastAutoTable?.finalY ?? 0;
}

// ─── Main report ─────────────────────────────────────────────────────────────
export function generateReport(result: TestResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  fillPage(doc);

  // ── Title ──
  doc.setFontSize(24);
  doc.setTextColor(...C.teal);
  doc.setFont('helvetica', 'bold');
  doc.text('DOS Security Test Report', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.textMuted);
  doc.text(ATTACK_LABELS[result.attackType] || result.attackType, pageWidth / 2, 37, { align: 'center' });
  doc.text(new Date(result.timestamp).toLocaleString(), pageWidth / 2, 44, { align: 'center' });

  doc.setDrawColor(...C.teal);
  doc.setLineWidth(0.6);
  doc.line(20, 50, pageWidth - 20, 50);

  // ── Test Configuration ──
  sectionHeading(doc, 'Test Configuration', 62);

  autoTable(doc, {
    startY: 66,
    theme: 'grid',
    headStyles: { fillColor: C.surface, textColor: C.teal, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fillColor: C.surface, textColor: C.textPrimary, fontSize: 9 },
    alternateRowStyles: { fillColor: C.surface2 },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
    body: [
      ['Attack Type', ATTACK_LABELS[result.attackType] || result.attackType],
      ['Mode', result.mode === 'auto' ? 'Auto-Attack' : 'Manual'],
      ['Target Model', result.targetModel],
      ['Attacker Model', result.attackerModel || 'N/A (Manual Mode)'],
      ['Total Requests', String(result.metrics.totalRequests)],
    ],
  });

  // ── Attack Metrics ──
  const metricsY = getLastY(doc) + 14;
  sectionHeading(doc, 'Attack Metrics', metricsY, C.purple);

  autoTable(doc, {
    startY: metricsY + 4,
    theme: 'grid',
    headStyles: { fillColor: C.surface, textColor: C.purple, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fillColor: C.surface, textColor: C.textPrimary, fontSize: 9 },
    alternateRowStyles: { fillColor: C.surface2 },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
    head: [['Metric', 'Value']],
    body: [
      ['Completed Requests', `${result.metrics.completedRequests} / ${result.metrics.totalRequests}`],
      ['Failed Requests',    String(result.metrics.failedRequests)],
      ['Timed Out',          String(result.metrics.timedOutRequests)],
      ['Avg Response Time',  `${result.metrics.avgResponseTime.toFixed(0)} ms`],
      ['Min Response Time',  `${result.metrics.minResponseTime.toFixed(0)} ms`],
      ['Max Response Time',  `${result.metrics.maxResponseTime.toFixed(0)} ms`],
      ['Total Tokens Used',  String(result.metrics.totalTokensUsed)],
      ['Avg Tokens / Request', result.metrics.avgTokensPerRequest.toFixed(1)],
      ['Error Rate', `${((result.metrics.failedRequests / Math.max(result.metrics.totalRequests, 1)) * 100).toFixed(1)}%`],
      ['Duration', `${((result.metrics.endTime || Date.now()) - result.metrics.startTime).toFixed(0)} ms`],
    ],
  });

  // ── Request Log with full responses ──
  doc.addPage();
  fillPage(doc);

  sectionHeading(doc, `Request Log  (${Math.min(result.responses.length, 20)} of ${result.responses.length})`, 20, C.pink);

  result.responses.slice(0, 20).forEach((r, i) => {
    const currentY = i === 0 ? 28 : getLastY(doc) + 10;

    // Check if we need a new page
    if (currentY > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      fillPage(doc);
    }

    const startY = i === 0 ? 28 : getLastY(doc) + 10;

    // Status color
    const statusColor = r.status === 'success' ? C.green : r.status === 'timeout' ? C.amber : C.red;

    // Header row for this entry
    autoTable(doc, {
      startY,
      theme: 'plain',
      headStyles: { fillColor: C.surface2, textColor: statusColor, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fillColor: C.surface, textColor: C.textPrimary, fontSize: 7.5 },
      tableLineColor: C.border,
      tableLineWidth: 0.15,
      head: [[
        `#${i + 1}  ${r.status.toUpperCase()}`,
        `${r.responseTime.toFixed(0)} ms`,
        `${r.tokensUsed} tokens`,
        r.error ? `Error: ${r.error.slice(0, 60)}` : '✓ OK',
      ]],
      body: [
        // Attack prompt
        ['ATTACK PROMPT', { content: r.prompt, colSpan: 3, styles: { textColor: C.teal, fontSize: 7, fontStyle: 'italic' } }],
        // Target model response
        [
          'MODEL RESPONSE',
          {
            content: r.response
              ? r.response.slice(0, 800) + (r.response.length > 800 ? '\n[truncated]' : '')
              : r.error || '(no response)',
            colSpan: 3,
            styles: {
              textColor: r.response ? C.textPrimary : C.red,
              fontSize: 7,
            },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: 30, textColor: C.textMuted, fontStyle: 'bold', fontSize: 7 },
      },
    });
  });

  // ── Save ──
  const filename = `dos_report_${result.attackType}_${new Date(result.timestamp).toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ─── Comparison report ────────────────────────────────────────────────────────
export function generateComparisonReport(results: TestResult[]): void {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();

  fillPage(doc);

  doc.setFontSize(22);
  doc.setTextColor(...C.teal);
  doc.setFont('helvetica', 'bold');
  doc.text('DOS Shield — Comparison Report', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.textMuted);
  doc.text(
    `Generated: ${new Date().toLocaleString()}  ·  ${results.length} test(s)`,
    pageWidth / 2, 33, { align: 'center' }
  );

  doc.setDrawColor(...C.teal);
  doc.setLineWidth(0.5);
  doc.line(20, 38, pageWidth - 20, 38);

  const rows = results.map((r) => [
    ATTACK_LABELS[r.attackType] || r.attackType,
    r.mode === 'auto' ? 'Auto' : 'Manual',
    r.targetModel.split('/').pop() || r.targetModel,
    r.attackerModel ? (r.attackerModel.split('/').pop() || r.attackerModel) : 'N/A',
    `${r.metrics.completedRequests}/${r.metrics.totalRequests}`,
    String(r.metrics.failedRequests),
    `${r.metrics.avgResponseTime.toFixed(0)} ms`,
    String(r.metrics.totalTokensUsed),
    `${((r.metrics.failedRequests / Math.max(r.metrics.totalRequests, 1)) * 100).toFixed(1)}%`,
    new Date(r.timestamp).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 44,
    theme: 'grid',
    headStyles: { fillColor: C.surface2, textColor: C.purple, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fillColor: C.surface, textColor: C.textPrimary, fontSize: 7.5 },
    alternateRowStyles: { fillColor: C.surface2 },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
    head: [['Attack', 'Mode', 'Target', 'Attacker', 'Completed', 'Failed', 'Avg Time', 'Tokens', 'Error %', 'Date']],
    body: rows,
  });

  doc.save(`dos_comparison_report_${new Date().toISOString().slice(0, 10)}.pdf`);
}