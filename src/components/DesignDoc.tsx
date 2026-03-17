import React, { useRef, useState } from 'react';
import { FileText, X, Download, Printer, Layers, GitBranch, Shield, Zap, Cpu, Loader2, Server, Database, Globe, Code2, Workflow } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DesignDocProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectureDiagram = () => (
  <div className="my-12 p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 flex flex-col items-center">
    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-8">System Architecture Topology</h4>
    <svg viewBox="0 0 800 400" className="w-full max-w-3xl drop-shadow-2xl">
      {/* Definitions for arrows */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Nodes */}
      {/* Engineer / GitLab */}
      <rect x="50" y="160" width="140" height="60" rx="12" fill="#1e1b4b" stroke="#3730a3" strokeWidth="2" />
      <text x="120" y="195" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">Git Providers</text>
      <text x="120" y="210" textAnchor="middle" fill="#6366f1" fontSize="10">GitHub / GitLab</text>

      {/* AI Orchestrator */}
      <rect x="330" y="160" width="140" height="60" rx="12" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
      <text x="400" y="195" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">AI Orchestrator</text>
      <text x="400" y="210" textAnchor="middle" fill="#3b82f6" fontSize="10">Node.js / Express</text>

      {/* Gemini 3.1 Pro */}
      <rect x="330" y="40" width="140" height="60" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
      <text x="400" y="75" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold">Gemini 3.1 Pro</text>
      <text x="400" y="90" textAnchor="middle" fill="#818cf8" fontSize="10">Semantic Engine</text>

      {/* Firebase */}
      <rect x="330" y="280" width="140" height="60" rx="12" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
      <text x="400" y="315" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">Firestore</text>
      <text x="400" y="330" textAnchor="middle" fill="#f59e0b" fontSize="10">Real-time State</text>

      {/* React Dashboard */}
      <rect x="610" y="160" width="140" height="60" rx="12" fill="#0c0a09" stroke="#10b981" strokeWidth="2" />
      <text x="680" y="195" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">React UI</text>
      <text x="680" y="210" textAnchor="middle" fill="#10b981" fontSize="10">Vite Dashboard</text>

      {/* Connections */}
      <path d="M190 190 H330" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="4" />
      <text x="260" y="180" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">Webhooks</text>

      <path d="M400 160 V100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="420" y="135" textAnchor="start" fill="#818cf8" fontSize="9" fontWeight="bold">Analysis</text>

      <path d="M400 220 V280" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="420" y="255" textAnchor="start" fill="#f59e0b" fontSize="9" fontWeight="bold">State Sync</text>

      <path d="M470 190 H610" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="540" y="180" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">Live Updates</text>
    </svg>
  </div>
);

const DataTable = ({ headers, rows }: { headers: string[], rows: string[][] }) => (
  <div className="my-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-zinc-900/80 border-b border-zinc-800">
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-4 text-xs font-black text-zinc-400 uppercase tracking-widest">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/50">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white/5 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-6 py-4 text-sm text-zinc-300 font-medium">
                {cell.startsWith('`') ? (
                  <code className="px-2 py-1 bg-zinc-800 rounded-md text-blue-400 text-xs font-mono">
                    {cell.replace(/`/g, '')}
                  </code>
                ) : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DesignDoc: React.FC<DesignDocProps> = ({ isOpen, onClose }) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportToPDF = async () => {
    if (!docRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const element = docRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#09090b',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('GitFlow-AI-Technical-Spec.pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Technical Design Specification</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black">Confidential • GitFlow AI v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-xs font-bold">
              <Printer size={14} /> Print
            </button>
            <button onClick={exportToPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl transition-all text-xs font-bold shadow-lg shadow-blue-600/20">
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
            <div className="w-px h-6 bg-zinc-800 mx-2" />
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-zinc-950">
          <div ref={docRef} className="max-w-4xl mx-auto space-y-16 pb-24">
            
            {/* Title Section */}
            <div className="border-b-4 border-blue-500 pb-12">
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter italic uppercase">GitFlow AI</h1>
              <p className="text-blue-400 font-bold uppercase tracking-[0.5em] text-sm">Semantic Orchestration Layer Specification</p>
              <div className="mt-8 flex gap-4">
                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Doc ID: GF-AI-2026-001</span>
                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status: Final</span>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Layers className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Executive Summary</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed text-lg">
                GitFlow AI is a next-generation orchestration layer designed to eliminate "Merge Hell" in large-scale engineering organizations. By leveraging the <span className="text-blue-400 font-bold">Gemini 3.1 Pro</span> multimodal model, the system semantically understands code changes, automates complex merge topologies, and provides real-time conflict resolution strategies that go beyond simple line-diffing.
              </p>
            </section>

            {/* 2. System Architecture */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Server className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. System Architecture</h2>
              </div>
              <p className="text-zinc-400 mb-8">
                The architecture is built on a reactive, event-driven model. It bridges the gap between traditional Git providers and advanced AI reasoning.
              </p>
              <ArchitectureDiagram />
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Database size={18} className="text-orange-400" />
                    Persistence Layer
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Firebase Firestore acts as the global state coordinator. It stores the merge queue, branch health metrics, and the AI's semantic reasoning logs for every operation.
                  </p>
                </div>
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Cpu size={18} className="text-indigo-400" />
                    AI Reasoning Engine
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Powered by Gemini 3.1 Pro. Unlike traditional merge tools, it analyzes the <span className="italic">intent</span> of changes, allowing it to resolve logical conflicts that standard Git would flag.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Semantic Conflict Resolution */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Shield className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">3. Conflict Resolution Strategies</h2>
              </div>
              <p className="text-zinc-400 mb-6">
                When conflicts occur, the AI Orchestrator selects the most appropriate semantic strategy based on the code context.
              </p>
              <DataTable 
                headers={["Strategy", "Logic", "Use Case"]}
                rows={[
                  ["Prefer A", "Discard Target, Keep Source", "Feature overrides or major refactors."],
                  ["Prefer B", "Discard Source, Keep Target", "Hotfixes or Master-priority changes."],
                  ["Keep Both", "Semantic Interleaving", "Independent additions to the same file."],
                  ["User Override", "Pause & Notify", "High-risk logic changes (Security/Auth)."]
                ]}
              />
            </section>

            {/* 4. Platform Integration */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Globe className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">4. Platform Integration</h2>
              </div>
              <p className="text-zinc-400 mb-6">
                GitFlow AI is platform-agnostic, supporting both GitLab and GitHub through a unified adapter architecture.
              </p>
              <DataTable 
                headers={["Feature", "GitLab (REST v4)", "GitHub (REST v3 / GraphQL)"]}
                rows={[
                  ["Code Diffs", "`GET .../diffs`", "`GET .../pulls/:num`"],
                  ["Merging", "`PUT .../merge`", "`PUT .../pulls/:num/merge`"],
                  ["Comments", "`POST .../notes`", "`POST .../issues/:num/comments`"],
                  ["Branches", "`POST .../branches`", "`POST .../git/refs`"],
                  ["CI Trigger", "`POST .../pipeline`", "`POST .../actions/workflows/.../dispatches`"]
                ]}
              />
            </section>

            {/* 5. Implementation Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <Code2 className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">5. Implementation Details</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="text-white font-bold text-lg mb-2 italic">The "Binary Search" Failure Isolation</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    When a batch of PRs fails CI, the orchestrator doesn't just fail the whole batch. It automatically splits the batch into two halves and merges them into separate staging branches. By recursively testing these halves, the AI isolates the specific breaking PR in O(log N) time, allowing the rest of the batch to proceed.
                  </p>
                </div>

                <div className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="text-white font-bold text-lg mb-2 italic">Atomic Union Groups</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Gemini analyzes the dependency graph of all pending PRs. If PR-A modifies a function signature used by PR-B, they are grouped into a **Union Group**. These groups are merged atomically—if one fails, the entire group is rolled back to maintain system stability.
                  </p>
                </div>

                <div className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="text-white font-bold text-lg mb-2 italic">Semantic Intent Analysis</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    The orchestrator uses Gemini to build a "Semantic AST" of the changes. Instead of comparing lines, it compares logic blocks. If PR-A renames a variable and PR-B uses the old variable name in a new function, GitFlow AI detects this as a logical conflict and automatically updates PR-B's code to use the new variable name, preventing a build failure that standard Git would miss.
                  </p>
                </div>

                <div className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="text-white font-bold text-lg mb-2 italic">Cross-Platform Semantic Translation</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    When merging between GitHub and GitLab, the AI doesn't just copy files. It translates platform-specific metadata. For example, it can convert GitHub Action YAML logic into GitLab CI/CD syntax on-the-fly to ensure that the target repository's automation remains functional.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Advanced Merge Topologies */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <GitBranch className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">6. Advanced Merge Topologies</h2>
              </div>
              <div className="space-y-4 text-zinc-400">
                <p>The system supports complex branching strategies beyond simple feature-to-master flows:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><span className="text-white font-bold">N-Way Star Merge</span>: Merging multiple feature branches into a single integration branch simultaneously using AI to resolve multi-way conflicts.</li>
                  <li><span className="text-white font-bold">Cascading Rebase</span>: Automatically rebasing a chain of dependent PRs (PR-C on PR-B on PR-A) when the root (PR-A) is updated.</li>
                  <li><span className="text-white font-bold">Shadow Integration</span>: Running background merges into a "shadow" branch to detect conflicts days before the actual merge deadline.</li>
                </ul>
              </div>
            </section>

            {/* 7. CI/CD Pipeline */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Workflow className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">7. CI/CD Pipeline Integration</h2>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                  <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">GitHub Workflows</h4>
                  <pre className="text-[10px] font-mono text-blue-400 bg-black/40 p-4 rounded-xl overflow-x-auto">
{`name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test`}
                  </pre>
                </div>
                <div className="p-6 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                  <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">GitLab Pipelines</h4>
                  <pre className="text-[10px] font-mono text-emerald-400 bg-black/40 p-4 rounded-xl overflow-x-auto">
{`stages:
  - test
test_job:
  stage: test
  script:
    - npm install
    - npm test`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-12 border-t border-zinc-900 flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              <p>© 2026 GitFlow AI Systems • All Rights Reserved</p>
              <p>Page 1 of 1</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
