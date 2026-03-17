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

| Strategy | Logic | Use Case |
| :--- | :--- | :--- |
| **Prefer A** | Discard Target, Keep Source | Feature overrides or refactors. |
| **Prefer B** | Discard Source, Keep Target | Hotfixes or Master-priority changes. |
| **Keep Both** | Semantic Interleaving | Independent additions to the same file. |
| **User Override** | Pause & Notify | High-risk logic changes (e.g., Security/Auth). |

## 5. Platform Integration Specification

GitFlow AI is platform-agnostic and supports both **GitLab** and **GitHub** through a unified adapter layer.

### 5.1 Webhook Subscriptions
The system listens for real-time events to drive orchestration:
- **Merge Request / Pull Request Events**: Triggers AI code review and queue management.
- **Pipeline / Action Events**: Monitors CI status (GitLab Pipelines or GitHub Actions).
- **Push Events**: Detects branch drift to initiate automated rebase cycles.
- **Comment Events**: Enables "ChatOps" style interaction (e.g., `@gitflow-ai merge`).

### 5.2 API Integration Mapping
| Feature | GitLab (REST v4) | GitHub (REST v3 / GraphQL) |
| :--- | :--- | :--- |
| **Code Diffs** | `GET .../merge_requests/:iid/diffs` | `GET .../pulls/:number` (Diff header) |
| **Merging** | `PUT .../merge_requests/:iid/merge` | `PUT .../pulls/:number/merge` |
| **Comments** | `POST .../merge_requests/:iid/notes` | `POST .../issues/:number/comments` |
| **Branches** | `POST .../repository/branches` | `POST .../git/refs` |
| **CI Trigger** | `POST .../pipeline` | `POST .../actions/workflows/:id/dispatches` |
| **Context** | `GET .../repository/files/:path` | `GET .../contents/:path` |

### 5.3 Cross-Platform Orchestration
GitFlow AI acts as a bridge for hybrid environments. It can orchestrate merges between a **GitHub Source** and a **GitLab Target** (or vice versa) by:
1. **Cloning**: Pulling the source branch from Provider A.
2. **Semantic Transformation**: Using Gemini to adapt code if platform-specific configurations (e.g., CI YAMLs) differ.
3. **Staging**: Pushing to an ephemeral staging branch on Provider B.
4. **Validation**: Running CI on Provider B to ensure compatibility.
5. **Final Merge**: Executing the merge on Provider B once verified.

## 6. CI/CD Pipeline Implementation

GitFlow AI leverages the native CI/CD capabilities of both platforms to ensure every merge is verified.

### 6.1 GitHub Workflows
To use GitHub Workflows with GitFlow AI:
1. **Definition**: Create YAML files in `.github/workflows/`.
2. **Structure**:
   ```yaml
   name: CI
   on: [push, pull_request, workflow_dispatch]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Run Tests
           run: npm test
   ```
3. **Orchestration**: GitFlow AI triggers these via `workflow_dispatch` for staging branches and monitors `check_suite` events for results.

### 6.2 GitLab Pipelines
To use GitLab CI/CD with GitFlow AI:
1. **Definition**: Create a `.gitlab-ci.yml` file in the root directory.
2. **Structure**:
   ```yaml
   stages:
     - test
   test_job:
     stage: test
     image: node:latest
     script:
       - npm install
       - npm test
   ```
3. **Orchestration**: GitFlow AI triggers pipelines via the API and polls the Pipeline status or listens for Pipeline Webhook events.

### 6.3 Automated Translation
When performing cross-platform merges, the AI Engine automatically translates between these two formats to maintain pipeline integrity in the target environment.

## 7. Security & Safety
- **Staging Branches**: All merges are tested in temporary staging branches before hitting Master.
- **No Force-Pushes**: The system uses clean rebase/merge cycles to maintain a linear, readable history.
- **Audit Logs**: Every AI decision is logged in Firestore for human review.
