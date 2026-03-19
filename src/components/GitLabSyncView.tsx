import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck, Activity, CheckCircle2, AlertTriangle, ArrowRight, Loader2, GitMerge, Zap, Github, Globe, RefreshCw, Terminal, Check } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

interface SyncCommit {
  id: string;
  message: string;
  author: string;
  date: string;
  status: 'synced' | 'pending' | 'failed';
}

export const GitLabSyncView: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [repoCreated, setRepoCreated] = useState(false);
  const [gitlabRepo, setGitlabRepo] = useState<any>(null);
  const [commits, setCommits] = useState<SyncCommit[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createRepo = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/gitlab/repo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'gitflow-ai', description: 'GitFlow AI Hackathon Submission' })
      });
      const data = await response.json();
      if (data.success) {
        setGitlabRepo(data.project);
        setRepoCreated(true);
        if (data.alreadyExists) {
          setLogs(prev => [...prev, `ℹ️ GitLab repository "gitflow-ai" already exists. ID: ${data.project.id}`]);
        } else {
          setLogs(prev => [...prev, `✅ GitLab repository "gitflow-ai" created successfully. ID: ${data.project.id}`]);
        }
      } else {
        setError(data.error || 'Failed to create repository.');
      }
    } catch (err: any) {
      setError('Network error while creating repository.');
    } finally {
      setIsCreating(false);
    }
  };

  const syncCommits = async () => {
    if (!repoCreated && !gitlabRepo) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setLogs(prev => [...prev, '🚀 Starting sync from GitHub (Shengliang/gitflow-ai) to GitLab...']);
    
    try {
      const response = await fetch('/api/gitlab/repo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          githubRepo: 'Shengliang/gitflow-ai', 
          gitlabProjectId: gitlabRepo?.id || 'gitflow-ai' 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          setSyncProgress(i);
          await new Promise(r => setTimeout(r, 200));
        }
        setCommits(data.commits);
        setLogs(prev => [...prev, `✅ Successfully synced ${data.commits.length} commits.`, '🔄 GitLab branch "master" updated.']);
      } else {
        setError(data.error || 'Failed to sync commits.');
      }
    } catch (err: any) {
      setError('Network error while syncing commits.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
            <RefreshCw className={`text-orange-500 w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">GitLab Sync Orchestrator</h2>
            <p className="text-white/40 text-sm">Cherry-pick and synchronize commits across platforms</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">GitFlow AI Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Create Repo */}
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${repoCreated ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  {repoCreated ? <Check size={14} /> : '1'}
                </div>
                <h3 className="text-lg font-bold text-white">Initialize GitLab Repository</h3>
              </div>
              {repoCreated && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Ready</span>
              )}
            </div>
            
            {!repoCreated ? (
              <div className="space-y-4">
                <p className="text-sm text-white/40 leading-relaxed">
                  Create the <span className="text-orange-500 font-mono">gitflow-ai</span> repository on GitLab to begin the synchronization process.
                </p>
                <button
                  onClick={createRepo}
                  disabled={isCreating}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/10"
                >
                  {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Globe size={20} />}
                  {isCreating ? 'Creating Repository...' : 'Create gitflow-ai on GitLab'}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-white">gitflow-ai</p>
                    <p className="text-[10px] text-white/40 font-mono">{gitlabRepo?.path_with_namespace || 'shengliang/gitflow-ai'}</p>
                  </div>
                </div>
                <a 
                  href={gitlabRepo?.web_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-white underline"
                >
                  View on GitLab
                </a>
              </div>
            )}
          </div>

          {/* Step 2: Sync Commits */}
          <div className={`bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6 transition-opacity ${!repoCreated ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${commits.length > 0 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  {commits.length > 0 ? <Check size={14} /> : '2'}
                </div>
                <h3 className="text-lg font-bold text-white">Sync from GitHub</h3>
              </div>
              {commits.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Synced</span>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Github size={20} className="text-white/40" />
                  <span className="text-sm font-mono text-white/60">Shengliang/gitflow-ai</span>
                </div>
                <ArrowRight size={16} className="text-white/20" />
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-orange-500" />
                  <span className="text-sm font-mono text-white/60">gitflow-ai</span>
                </div>
              </div>

              <button
                onClick={syncCommits}
                disabled={isSyncing || !repoCreated}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isSyncing || !repoCreated
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20'
                }`}
              >
                {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                {isSyncing ? 'Syncing Commits...' : 'Sync with GitLab'}
              </button>
            </div>

            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Sync Progress</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logs */}
          {(logs.length > 0 || error) && (
            <div className="bg-black border border-white/10 rounded-[32px] p-8 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Terminal size={18} className="text-orange-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Execution Logs</h4>
              </div>
              <div className="bg-[#1C1D21] rounded-2xl p-6 font-mono text-[10px] space-y-2 max-h-48 overflow-y-auto border border-white/5">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.includes('✅') ? 'text-emerald-400' : 'text-white/60'}>{log}</span>
                  </div>
                ))}
                {error && (
                  <div className="flex gap-3 text-rose-500">
                    <span className="text-rose-500/20">[{new Date().toLocaleTimeString()}]</span>
                    <span>❌ Error: {error}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-6 space-y-6">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Synced Commits</h3>
            <div className="space-y-4">
              {commits.length > 0 ? commits.map((commit) => (
                <div key={commit.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-500">{commit.id.substring(0, 7)}</span>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded">Synced</span>
                  </div>
                  <p className="text-xs text-white font-medium line-clamp-1">{commit.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>{commit.author}</span>
                    <span>{new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-white/20 italic text-xs">
                  No commits synced yet
                </div>
              )}
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">AI Insight</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed italic">
              "Syncing from GitHub to GitLab ensures high availability. GitFlow AI will automatically resolve any semantic drift during the cherry-pick process."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
