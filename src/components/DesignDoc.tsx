import React, { useRef, useState } from 'react';
import { FileText, X, Download, Printer, Layers, GitBranch, Shield, Zap, Cpu, Loader2, Server, Database, Globe, Code2, Workflow, CheckCircle2 } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

const SectionFooter = ({ page, total }: { page: number, total: number }) => (
  <div className="mt-12 pt-8 border-t border-zinc-900/50 flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
    <p>© 2026 GitFlow AI Systems • Technical Specification</p>
    <p>Page {page} of {total}</p>
  </div>
);

export const DesignDoc: React.FC<DesignDocProps> = ({ isOpen, onClose }) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportToPDF = async () => {
    if (!docRef.current || isExporting) return;
    
    setIsExporting(true);
    
    const element = docRef.current;
    const opt = {
      margin: 10,
      filename: 'GitFlow-AI-Technical-Specification.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          // 1. Force white background on the body and main container
          const content = clonedDoc.getElementById('design-doc-content');
          if (content) {
            content.style.backgroundColor = '#ffffff';
            content.style.color = '#000000';
            // Ensure the parent container is also white
            if (content.parentElement) {
              content.parentElement.style.backgroundColor = '#ffffff';
            }
          }

          // 2. Aggressively strip oklab/oklch from all style tags and computed styles
          const styleTags = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleTags.length; i++) {
            styleTags[i].innerHTML = styleTags[i].innerHTML
              .replace(/oklch\([^)]+\)/g, '#000000')
              .replace(/oklab\([^)]+\)/g, '#000000')
              .replace(/color-mix\([^)]+\)/g, '#888888'); // Also strip color-mix which can be problematic
          }

          // 3. Scan all elements for theme conversion and style fixes
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            
            // Force light theme classes or styles
            const className = el.className || '';
            if (typeof className === 'string') {
              // Backgrounds
              if (className.includes('bg-zinc-950')) el.style.backgroundColor = '#ffffff';
              if (className.includes('bg-zinc-900')) el.style.backgroundColor = '#f8f8f8';
              if (className.includes('bg-black')) el.style.backgroundColor = '#f8f8f8';
              if (className.includes('bg-zinc-800')) el.style.backgroundColor = '#e5e5e5';
              
              // Text
              if (className.includes('text-white')) el.style.color = '#000000';
              if (className.includes('text-zinc-100')) el.style.color = '#111111';
              if (className.includes('text-zinc-300')) el.style.color = '#333333';
              if (className.includes('text-zinc-400')) el.style.color = '#555555';
              if (className.includes('text-zinc-500')) el.style.color = '#666666';
              
              // Borders
              if (className.includes('border-zinc-800')) el.style.borderColor = '#dddddd';
              if (className.includes('border-zinc-900')) el.style.borderColor = '#eeeeee';
            }

            // Fix inline styles and attributes
            const inlineStyle = el.getAttribute('style');
            if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('oklab') || inlineStyle.includes('color-mix'))) {
              el.setAttribute('style', inlineStyle
                .replace(/oklch\([^)]+\)/g, '#000000')
                .replace(/oklab\([^)]+\)/g, '#000000')
                .replace(/color-mix\([^)]+\)/g, '#888888'));
            }

            // Fix computed styles that might still be active or need inversion
            // We use a more direct approach here to avoid expensive getComputedStyle if possible
            const properties = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'fill', 'stroke'];
            properties.forEach(prop => {
              const value = (el.style as any)[prop];
              
              // Handle oklch/oklab/color-mix in inline styles
              if (value && (value.includes('oklch') || value.includes('oklab') || value.includes('color-mix'))) {
                let fallback = '#000000';
                if (prop.toLowerCase().includes('background')) fallback = '#ffffff';
                if (prop.toLowerCase().includes('border')) fallback = '#dddddd';
                (el.style as any)[prop] = fallback;
              }
            });
            
            // Special handling for SVGs
            if (el.tagName.toLowerCase() === 'svg') {
              el.setAttribute('fill', el.getAttribute('fill')?.replace(/oklch\([^)]+\)/g, '#000000').replace(/oklab\([^)]+\)/g, '#000000') || '');
              el.setAttribute('stroke', el.getAttribute('stroke')?.replace(/oklch\([^)]+\)/g, '#000000').replace(/oklab\([^)]+\)/g, '#000000') || '');
            }
          }
        }
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all' as const, 'css' as const, 'legacy' as const] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('PDF generation failed. Please try using the Print button.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:hidden">
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
              {isExporting ? 'Generating PDF...' : 'Export PDF'}
            </button>
            <div className="w-px h-6 bg-zinc-800 mx-2" />
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-zinc-950 scrollbar-hide">
          <div ref={docRef} id="design-doc-content" className="max-w-4xl mx-auto space-y-16 pb-24">
            
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
            <section className="page-break-after">
              <div className="flex items-center gap-4 mb-6">
                <Layers className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Executive Summary</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed text-lg">
                GitFlow AI is a next-generation orchestration layer designed to eliminate "Merge Hell" in large-scale engineering organizations. By leveraging the <span className="text-blue-400 font-bold">Gemini 3.1 Pro</span> multimodal model, the system semantically understands code changes, automates complex merge topologies, and provides real-time conflict resolution strategies that go beyond simple line-diffing.
              </p>
              <SectionFooter page={1} total={7} />
            </section>

            {/* 2. System Architecture */}
            <section className="page-break-after">
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
              <SectionFooter page={2} total={7} />
            </section>

            {/* 3. Semantic Conflict Resolution */}
            <section className="page-break-after">
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
              <SectionFooter page={3} total={7} />
            </section>

            {/* 4. Platform Integration */}
            <section className="page-break-after">
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
              <SectionFooter page={4} total={7} />
            </section>

            {/* 5. Implementation Details */}
            <section className="space-y-8 page-break-after">
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
              <SectionFooter page={5} total={7} />
            </section>

            {/* 6. Advanced Merge Topologies */}
            <section className="page-break-after">
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
              <SectionFooter page={6} total={7} />
            </section>

            {/* 7. CI/CD Pipeline */}
            <section className="page-break-after">
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
              <SectionFooter page={7} total={7} />
            </section>

            {/* Footer */}
            <div className="pt-12 border-t border-zinc-900 flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              <p>© 2026 GitFlow AI Systems • All Rights Reserved</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
