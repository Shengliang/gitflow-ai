import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, X } from 'lucide-react';

interface DesignDocProps {
  isOpen: boolean;
  onClose: () => void;
}

const designDocContent = `# GitFlow AI: Design Document

## 1. Executive Summary
GitFlow AI is an intelligent orchestration layer for complex Git workflows. It solves "Merge Hell" in large-scale engineering teams by using Gemini Pro to semantically understand code changes, automate conflict resolution, and manage complex merge topologies.

## 2. System Architecture
- **Frontend**: React + Tailwind CSS (Vite)
- **Real-time Sync**: Firebase Firestore for live merge queue and branch status.
- **AI Engine**: Gemini 3.1 Pro for semantic analysis and code review.
- **State Management**: React Context for global orchestration state.

## 3. Core Features

### 3.1 AI Auto Code Review
Every Pull Request is automatically analyzed by Gemini before a merge attempt. The AI provides:
- Semantic bug detection.
- Style consistency checks.
- Complexity analysis.

### 3.2 Advanced Merge Orchestration
The system supports two primary merge modes for multi-branch environments:
- **Mode A (Divide & Conquer)**: A binary tree merge strategy. 8 branches are treated as leaves and merged in pairs iteratively until reaching the root (Master).
- **Mode B (FIFO Batching)**: Merges PRs in sequential batches. Users can configure batch sizes (e.g., merge 5 PRs at once).

### 3.3 Atomic Union Groups
AI can identify "Union Groups"—sets of PRs that are functionally dependent. These are merged in an "all-or-nothing" atomic operation to prevent partial system breakage.

### 3.4 The Tag-Based Rebase Cycle
To keep project branches in sync with Master:
1. **Tagging**: Mark the merge range (Tag-X to Tag-Y).
2. **Integration**: Merge range [X, Y] into Master.
3. **Fresh Base**: Cut a new project branch from the new Master head.
4. **Automated Rebase**: All pending PRs in the [Y+1, Current] range are automatically rebased onto the new project branch.

## 4. Conflict Resolution Strategy
When conflicts occur, GitFlow AI offers 4 semantic strategies:
1. **Prefer A**: Take changes from the source branch.
2. **Prefer B**: Take changes from the target branch.
3. **Keep Both**: Intelligently combine both blocks.
4. **User Override**: Flag for manual intervention if semantic intent is ambiguous.

## 5. Security & Safety
- **Staging Branches**: All merges are tested in temporary staging branches before hitting Master.
- **No Force-Pushes**: The system uses clean rebase/merge cycles to maintain a linear, readable history.
- **Audit Logs**: Every AI decision is logged in Firestore for human review.
`;

export const DesignDoc: React.FC<DesignDocProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Technical Design Document</h2>
              <p className="text-sm text-zinc-400">Architecture & Workflow Specification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-emerald max-w-none">
          <div className="markdown-body">
            <ReactMarkdown>{designDocContent}</ReactMarkdown>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-all font-medium"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
