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
  lastCommit?: string;
  status?: string;
}

export interface Team {
  id: string;
  name: string;
  engineers: string[];
  members?: number;
  activeMRs?: number;
  performance?: number;
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
  authorAvatar?: string;
  branch?: string;
  url?: string;
  labels?: string[];
  platform?: string;
}

export interface MergeJob {
  id: string;
  prId?: string;
  batchPrIds?: string[];
  isBatch?: boolean;
  batchName?: string;
  queueId?: string;
  status: 'queued' | 'resolving_conflicts' | 'running_tests' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  aiResolution?: string;
  priority?: 'high' | 'standard';
  createdAt?: number;
}

export interface MergeQueue {
  id: string;
  name: string;
  targetBranch: string;
  strategy: 'binary_tree' | 'fifo';
  batchSize: number;
  leafBranches: string[];
  isActive: boolean;
  createdAt: number;
  priority?: 'high' | 'standard';
}
