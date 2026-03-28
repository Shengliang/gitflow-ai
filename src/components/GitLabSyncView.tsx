import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck, Activity, CheckCircle2, AlertTriangle, ArrowRight, Loader2, GitMerge, Zap, Github, Globe, RefreshCw, Terminal, Check } from 'lucide-react';

interface SyncCommit {
  id: string;
  message: string;
  author: string;
  date: string;
  status: 'synced' | 'pending' | 'failed';
}

export const GitLabSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [gitlabRepo, setGitlabRepo] = useState<any>(null);
  const [commits, setCommits] = useState<SyncCommit[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [forceSync, setForceSync] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      // 1. Fetch config
      let currentConfig: any = null;
      try {
        const res = await fetch('/api/config');
        currentConfig = await res.json();
        setConfig(currentConfig);
      } catch (e) {
        console.error('Failed to fetch config:', e);
      }

      // 2. Check GitLab repository existence silently
      if (currentConfig) {
        const gitlabPath = cleanPath(currentConfig.GITLAB_REPRO || 'shengliangsong/gitflow-ai', 'shengliangsong/gitflow-ai');
        const repoName = gitlabPath.split('/').pop() || 'gitflow-ai';
        
        try {
          const response = await fetch('/api/gitlab/repo/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name: repoName, 
              fullPath: gitlabPath
            })
          });
          const data = await response.json();
          if (data.success) {
            setGitlabRepo(data.project);
          }
        } catch (e) {
          console.error('Failed to auto-connect GitLab repo:', e);
        }
      }

      // 3. Check if token is likely missing
      try {
        const res = await fetch('/api/gitlab/projects');
        const data = await res.json();
        if (res.status === 400 && data.error?.includes('TOKEN')) {
          setTokenMissing(true);
        }
      } catch (e) {
        // Ignore
      }
      setIsInitializing(false);
    };
    
    init();
  }, []);

  const syncCommits = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const githubPath = cleanPath(config?.GITHUB_REPO?.includes('/') 
      ? config.GITHUB_REPO 
      : `${config?.GITHUB_OWNER || 'Shengliang'}/${config?.GITHUB_REPO || 'gitflow-ai'}`, 'shengliangsong/gitflow-ai');
    const gitlabPath = cleanPath(config?.GITLAB_REPRO || 'shengliangsong/gitflow-ai', 'shengliangsong/gitflow-ai');
    
    setLogs(prev => [...prev, `🚀 Starting sync from GitHub (${githubPath}) to GitLab (${gitlabPath})...`]);
    
    try {
      const response = await fetch('/api/gitlab/repo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          githubRepo: githubPath, 
          gitlabProjectId: gitlabRepo?.path_with_namespace || gitlabPath,
          force: forceSync
        })
      });
      
      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (response.ok && data.success) {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          setSyncProgress(i);
          await new Promise(r => setTimeout(r, 200));
        }
        setCommits(data.commits);
        setLogs(prev => [...prev, `✅ Successfully synced ${data.commits.length} commits.`, '🔄 GitLab repository updated.']);
      } else {
        const errorMsg = data.error || data.message || response.statusText || 'Failed to sync commits.';
        setLogs(prev => [...prev, `❌ Error: ${errorMsg}`]);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Sync error:', err);
      const errorMsg = err.message || 'Network error while syncing commits.';
      setLogs(prev => [...prev, `❌ Error: ${errorMsg}`]);
      setError(errorMsg);
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
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">GitFlow AI Active</span>
          </div>
          {tokenMissing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <AlertTriangle size={12} className="text-rose-500" />
              <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">GITLAB_TOKEN Missing</span>
            </div>
          )}
        </div>
      </div>

      {tokenMissing && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500/10 border border-rose-500/20 rounded-[32px] p-8 flex items-start gap-6"
        >
          <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="text-rose-500" size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">GitLab Integration Required</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              To use the Sync Orchestrator, you must configure a <span className="text-white font-bold">GITLAB_TOKEN</span> in your environment variables. 
              This token needs <span className="font-mono text-orange-500">api</span> scope to create repositories and sync commits.
            </p>
            <div className="pt-2 flex gap-4">
              <a 
                href="https://gitlab.com/-/profile/personal_access_tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1"
              >
                Create Token <ArrowRight size={12} />
              </a>
              <p className="text-[10px] text-white/30 italic">Add to .env or Settings menu</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Sync Commits Card */}
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold ${commits.length > 0 ? 'bg-emerald-500 text-white' : 'bg-orange-500/20 text-orange-500'}`}>
                  {commits.length > 0 ? <Check size={18} /> : <GitMerge size={18} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GitHub to GitLab Sync</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Safe Cherry-Pick Strategy</p>
                </div>
              </div>
              {commits.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Synced</span>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-6 bg-white/5 rounded-[24px] border border-white/5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white/40 mb-1">
                    <Github size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Source</span>
                  </div>
                  <span className="text-sm font-mono text-white font-bold truncate">
                    {cleanPath(config?.GITHUB_REPO?.includes('/') 
                      ? config.GITHUB_REPO 
                      : `${config?.GITHUB_OWNER || 'Shengliang'}/${config?.GITHUB_REPO || 'gitflow-ai'}`, 'shengliangsong/gitflow-ai')}
                  </span>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ArrowRight size={16} className="text-white/20" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-orange-500 mb-1">
                    <Globe size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Destination</span>
                  </div>
                  <span className="text-sm font-mono text-white font-bold truncate">
                    {cleanPath(config?.GITLAB_REPRO || 'shengliangsong/gitflow-ai', 'shengliangsong/gitflow-ai')}
                    <span className="ml-2 text-[10px] text-orange-500/60 uppercase tracking-tighter">(release branch)</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${forceSync ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-white/20'}`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Force Sync Mode</p>
                    <p className="text-[10px] text-white/40">Resolve conflicts by favoring GitHub (uses -X theirs)</p>
                  </div>
                </div>
                <button 
                  onClick={() => setForceSync(!forceSync)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${forceSync ? 'bg-rose-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${forceSync ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <button
                onClick={syncCommits}
                disabled={isSyncing || isInitializing}
                className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  isSyncing || isInitializing
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-[0.98]'
                }`}
              >
                {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                <span className="text-lg">{isSyncing ? 'Synchronizing...' : 'Start Synchronization'}</span>
              </button>

              {gitlabRepo && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <a 
                    href={gitlabRepo.web_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-white/40 hover:text-orange-500 flex items-center gap-1.5 transition-colors"
                  >
                    <Globe size={12} />
                    View GitLab Repo
                  </a>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[10px] font-mono text-white/20">ID: {gitlabRepo.id}</span>
                </div>
              )}
            </div>

            {isSyncing && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Syncing Repository History</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
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

const cleanPath = (raw: string | undefined, fallback: string) => {
  if (!raw) return fallback;
  const urlMatch = raw.match(/https?:\/\/(?:github|gitlab)\.com\/([^\s]+)/);
  if (urlMatch) {
    return urlMatch[1].replace(/\/$/, '').replace(/\.git$/, '');
  }
  if (raw.includes('/')) {
    const parts = raw.split('/');
    if (parts[1] && parts[1].startsWith('http')) {
      return cleanPath(raw.substring(parts[0].length + 1), fallback);
    }
    return raw.replace(/\/$/, '');
  }
  return raw;
};
