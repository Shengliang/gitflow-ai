# GitFlow AI: Design Document

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
