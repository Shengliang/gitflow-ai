import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, X, Download, Printer, Layers, GitBranch, Shield, Zap, Cpu, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DesignDocProps {
  isOpen: boolean;
  onClose: () => void;
}

const designDocContent = `# GitFlow AI: Technical Specification & Architecture

## 1. Executive Summary
GitFlow AI is a next-generation orchestration layer designed to eliminate "Merge Hell" in large-scale engineering organizations. By leveraging the **Gemini 3.1 Pro** multimodal model, the system semantically understands code changes, automates complex merge topologies, and provides real-time conflict resolution strategies that go beyond simple line-diffing.

---

## 2. System Architecture

### 2.1 High-Level Overview
The system follows a distributed architecture with a real-time synchronization layer.

\`\`\`mermaid
graph TD
    A[Engineer / GitLab] -->|Webhooks| B[AI Orchestrator]
    B -->|Semantic Analysis| C[Gemini 3.1 Pro]
    C -->|Resolution Strategy| B
    B -->|State Sync| D[Firebase Firestore]
    D -->|Real-time Updates| E[React Dashboard]
    B -->|Git Operations| F[GitLab API / Runner]
    F -->|CI Results| B
\`\`\`

### 2.2 Component Breakdown
- **Frontend (React 18)**: A high-fidelity, brutalist dashboard providing "Mission Control" visibility.
- **State Layer (Firebase)**: Handles real-time synchronization of merge queues, branch health, and AI reasoning logs.
- **AI Engine (Gemini)**: The core decision-making unit. It performs:
    - **Semantic Code Review**: Analyzing PRs for logic errors and style.
    - **Conflict Resolution**: Choosing between Prefer A, Prefer B, or Keep Both based on intent.
    - **Topology Management**: Orchestrating multi-branch merges.

---

## 3. Advanced Merge Orchestration

### 3.1 Mode A: Binary Tree (Divide & Conquer)
Designed for massive releases where 8+ project branches must hit Master simultaneously.
1. **Level 0**: 8 Project Branches (Leaves).
2. **Level 1**: 4 Staging Branches (Pairwise merges of L0).
3. **Level 2**: 2 Integration Branches (Pairwise merges of L1).
4. **Level 3**: Master Branch (Final merge of L2).

### 3.2 Mode B: FIFO Batching
Ideal for continuous delivery. PRs are queued and merged in batches of size *N* (configurable). If a batch fails CI, the AI performs a "Binary Search" to isolate the breaking PR.

### 3.3 Atomic Union Groups
Gemini analyzes the dependency graph of all pending PRs. If PR-A modifies a function used by PR-B, they are grouped into a **Union Group**. These groups are merged atomically—if one fails, the entire group is rolled back to maintain system stability.

---

## 4. The Tag-Based Rebase Cycle (The "Sync" Workflow)
To prevent project branches from drifting too far from Master, GitFlow AI automates a sophisticated rebase cycle:

1. **Tagging**: The system identifies the range of commits to be integrated (e.g., from \`Tag-2026.03.A\` to \`Tag-2026.03.B\`).
2. **Master Integration**: The range is merged into Master via a squash-merge to keep history clean.
3. **Branch Rotation**: A new project branch (e.g., \`release-v2-sync\`) is cut from the new Master head.
4. **Automated Rebase**: All PRs that were targeting the old project branch are automatically rebased onto the new branch. AI handles any trivial conflicts arising from the rebase.

---

## 5. Semantic Conflict Resolution
GitFlow AI uses Gemini to resolve conflicts by understanding the **Intent** of the code, not just the characters.

| Strategy | Logic | Use Case |
| :--- | :--- | :--- |
| Prefer A | Discard Target, Keep Source | Feature overrides or refactors. |
| Prefer B | Discard Source, Keep Target | Hotfixes or Master-priority changes. |
| Keep Both | Semantic Interleaving | Independent additions to the same file. |
| User Override | Pause & Notify | High-risk logic changes (e.g., Security/Auth). |

---

## 6. Platform Integration Specification

GitFlow AI is platform-agnostic, supporting both **GitLab** and **GitHub** through a unified adapter architecture.

### 6.1 Webhook Subscriptions
The system listens for real-time events to drive orchestration logic:
- **MR / PR Events**: Triggers AI code review and queue management.
- **Pipeline / Action Events**: Monitors CI status (GitLab Pipelines or GitHub Actions).
- **Push Events**: Detects branch drift to initiate automated rebase cycles.
- **Comment Events**: Enables "ChatOps" style interaction (e.g., \`@gitflow-ai merge\`).

### 6.2 API Integration Mapping
| Feature | GitLab (REST v4) | GitHub (REST v3 / GraphQL) |
| :--- | :--- | :--- |
| **Code Diffs** | \`GET .../diffs\` | \`GET .../pulls/:num\` |
| **Merging** | \`PUT .../merge\` | \`PUT .../pulls/:num/merge\` |
| **Comments** | \`POST .../notes\` | \`POST .../issues/:num/comments\` |
| **Branches** | \`POST .../branches\` | \`POST .../git/refs\` |
| **CI Trigger** | \`POST .../pipeline\` | \`POST .../actions/workflows/.../dispatches\` |

### 6.3 Cross-Platform Orchestration
GitFlow AI acts as a semantic bridge for hybrid environments. It can orchestrate merges between a **GitHub Source** and a **GitLab Target** (or vice versa) by:
- **Cloning & Buffering**: Pulling the source branch from Provider A into a secure orchestration buffer.
- **Semantic Adaptation**: Gemini analyzes and adapts platform-specific logic (e.g., converting GitHub Action syntax to GitLab CI if necessary).
- **Staging & Verification**: Pushing to an ephemeral staging branch on Provider B and triggering Provider B's CI suite.
- **Atomic Execution**: Once CI passes on the target platform, the AI executes the final merge.

---

## 7. Security & Compliance
- **No Force-Pushes**: The orchestrator uses clean rebase and merge-commit strategies.
- **Audit Trails**: Every AI-driven merge is logged with the Gemini reasoning string in Firestore.
- **Staging Isolation**: Merges are always performed in ephemeral staging branches before touching protected branches.

---

## 8. Future Roadmap
- **Predictive Conflict Detection**: Analyzing PRs *before* they are submitted to warn developers of impending conflicts.
- **Automated Unit Test Generation**: AI writes tests specifically for the "conflict zones" of a merge.
- **Multi-Cloud Orchestration**: Supporting hybrid GitLab/GitHub environments.
`;

export const DesignDoc: React.FC<DesignDocProps> = ({ isOpen, onClose }) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportToPDF = async () => {
    if (!docRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      const element = docRef.current;
      
      // Ensure the element is fully visible for capture
      const originalStyle = element.style.height;
      element.style.height = 'auto';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#09090b',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('pdf-content');
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
          }
        }
      });
      
      element.style.height = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Handle multi-page if necessary (though a4 is usually enough for this doc)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('GitFlow-AI-Design-Doc.pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Please try using the Print button instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:p-0 print:bg-white">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden print:shadow-none print:border-none print:max-h-none print:w-full print:rounded-none">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 print:hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Technical Design Specification</h2>
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Confidential • GitFlow AI v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all text-sm font-bold"
            >
              <Printer size={16} />
              Print
            </button>
            <button 
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
            <div className="w-px h-6 bg-zinc-800 mx-2" />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 print:p-0">
          <div id="pdf-content" ref={docRef} className="max-w-4xl mx-auto space-y-12 bg-zinc-950 p-12 rounded-3xl border border-zinc-900 shadow-inner print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
            {/* Header for PDF/Print */}
            <div className="flex justify-between items-start border-b-4 border-blue-500 pb-8">
              <div>
                <h1 className="text-4xl font-black text-white print:text-black mb-2 tracking-tighter italic">GITFLOW AI</h1>
                <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">Orchestration Layer Specification</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Document ID</p>
                <p className="text-white print:text-black font-mono text-sm">GF-AI-2026-001</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 print:hidden">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center gap-3">
                <Cpu className="text-blue-400" size={20} />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Gemini 3.1 Pro</span>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center gap-3">
                <Shield className="text-emerald-400" size={20} />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Enterprise Grade</span>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center gap-3">
                <Zap className="text-orange-400" size={20} />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Real-time Sync</span>
              </div>
            </div>

            <div className="markdown-body prose prose-invert prose-blue max-w-none print:prose-neutral">
              <ReactMarkdown>{designDocContent}</ReactMarkdown>
            </div>

            {/* Footer for PDF/Print */}
            <div className="mt-20 pt-8 border-t border-zinc-800 flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <p>© 2026 GitFlow AI Systems</p>
              <p>GitLab Hackathon Submission</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
