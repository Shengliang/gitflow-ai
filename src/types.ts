/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BranchType = 'master' | 'project' | 'release';

export interface Branch {
  id: string;
  name: string;
  type: BranchType;
  teamId?: string;
  lastMergedAt?: number;
}

export interface Team {
  id: string;
  name: string;
  engineers: string[];
}

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  authorUid: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merging' | 'merged' | 'conflict' | 'failed_tests';
  createdAt: number;
  conflictDetails?: string;
  testResults?: string;
}

export interface MergeJob {
  id: string;
  prId: string;
  status: 'queued' | 'resolving_conflicts' | 'running_tests' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  aiResolution?: string;
}
