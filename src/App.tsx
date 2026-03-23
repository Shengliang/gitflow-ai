/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { GitLabDoAgent } from './components/GitLabDoAgent';
import { PRCard } from './components/PRCard';
import { MergeQueue } from './components/MergeQueue';
import { BranchGraph } from './components/BranchGraph';
import { JudgeView } from './components/JudgeView';
import { DemoView } from './components/DemoView';
import { RepoView } from './components/RepoView';
import { RoadmapView } from './components/RoadmapView';
import { ReleaseView } from './components/ReleaseView';
import { AgentView } from './components/AgentView';
import { GitLabSyncView } from './components/GitLabSyncView';
import { ProjectInfo } from './components/ProjectInfo';
import { DesignDoc } from './components/DesignDoc';
import { CLIInterface } from './components/CLIInterface';
import { LocalCLITab } from './components/LocalCLITab';
import { Branch, PullRequest, MergeJob, Team, MergeQueue as MergeQueueType } from './types';
import { GitPullRequest, Users, GitBranch, GitMerge, Zap, Activity, ShieldCheck, LogIn, LogOut, AlertTriangle, RefreshCw, Plus, Trash2, ChevronRight, ListOrdered, Settings2, Github, Globe, PanelLeft, PanelRight, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCLIOpen, setIsCLIOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([
    {
      id: 'pr-1',
      title: 'feat: AI-powered binary tree merge strategy',
      author: 'Shengliang',
      authorUid: 'user-1',
      authorAvatar: 'https://picsum.photos/seed/sheng/100/100',
      branch: 'feature/ai-orchestrator',
      sourceBranch: 'feature/ai-orchestrator',
      targetBranch: 'master',
      status: 'open',
      createdAt: Date.now() - 3600000,
      url: '#',
      labels: ['ai', 'core'],
      platform: 'gitlab'
    }
  ]);
  const [selectedPrIds, setSelectedPrIds] = useState<string[]>([]);
  const [queue, setQueue] = useState<MergeJob[]>([]);
  const [mergeQueues, setMergeQueues] = useState<MergeQueueType[]>([
    {
      id: 'mq-1',
      name: 'Main Release Queue',
      targetBranch: 'master',
      strategy: 'binary_tree',
      batchSize: 5,
      leafBranches: ['feature/auth', 'feature/ui', 'fix/bugs'],
      isActive: true,
      createdAt: Date.now()
    }
  ]);
  const [teams, setTeams] = useState<Team[]>([
    { id: 't1', name: 'Core Engine', engineers: ['Alice', 'Bob'], members: 5, activeMRs: 3, performance: 98 },
    { id: 't2', name: 'AI Research', engineers: ['Charlie', 'David'], members: 3, activeMRs: 2, performance: 95 }
  ]);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalMerges: 124,
    conflictsResolved: 42,
    testSuccessRate: 98.5,
  });

  useEffect(() => {
    // Mock auth readiness
    const savedUser = localStorage.getItem('gitflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  // Polling for branches
  useEffect(() => {
    if (!user) {
      setBranches([]);
      return;
    }

    const fetchBranches = async () => {
      try {
        const res = await fetch('/api/branches');
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };

    fetchBranches();
    const interval = setInterval(fetchBranches, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Polling for merge queue
  useEffect(() => {
    if (!user) {
      setQueue([]);
      return;
    }

    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/merge-queue');
        if (res.ok) {
          const data = await res.json();
          setQueue(data);
        }
      } catch (err) {
        console.error('Error fetching merge queue:', err);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const fetchGitLabData = async () => {
      try {
        const projectsRes = await fetch('/api/gitlab/projects');
        const projectsData = await projectsRes.json();
        
        if (projectsRes.ok && projectsData.repositories && projectsData.repositories.length > 0) {
          const projectId = projectsData.repositories[0].id.replace('gl-', '');
          
          // Fetch Stats
          const statsRes = await fetch(`/api/gitlab/projects/${projectId}/stats`);
          const statsData = await statsRes.json();
          
          if (statsRes.ok && statsData.stats) {
            setStats(prev => ({
              ...prev,
              totalMerges: statsData.stats.totalMerges || prev.totalMerges,
            }));
          }

          // Fetch MRs
          const mrsRes = await fetch(`/api/gitlab/projects/${projectId}/mrs`);
          const mrsData = await mrsRes.json();
          
          if (mrsRes.ok && mrsData.mrs) {
            // Map GitLab MRs to our PullRequest type
            const gitlabPrs: PullRequest[] = mrsData.mrs.map((mr: any) => ({
              id: mr.id,
              title: mr.title,
              author: mr.author,
              authorAvatar: mr.authorAvatar,
              branch: mr.sourceBranch,
              targetBranch: mr.targetBranch,
              status: mr.status,
              createdAt: mr.createdAt,
              url: mr.url,
              labels: mr.labels,
              platform: 'gitlab'
            }));
            
            // Merge with GitLab PRs, avoiding duplicates
            setPrs(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newPrs = gitlabPrs.filter(p => !existingIds.has(p.id));
              return [...prev, ...newPrs].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            });
          }
        }
      } catch (err) {
        console.error('Error fetching GitLab data:', err);
      }
    };

    fetchGitLabData();
  }, []);

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => {
      window.removeEventListener('changeTab', handleTabChange);
    };
  }, []);

  const handleLogin = async (providerType: 'google' | 'github' | 'gitlab' = 'google') => {
    setLoginError(null);
    // Mock login for demo
    const mockUser = {
      uid: 'user-' + Math.random().toString(36).substring(7),
      displayName: 'Shengliang Song',
      email: 'shengliang.song@gmail.com',
      photoURL: 'https://picsum.photos/seed/sheng/100/100'
    };
    setUser(mockUser);
    localStorage.setItem('gitflow_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gitflow_user');
  };

  const createMergeQueue = () => {
    const newQueue: MergeQueueType = {
      id: `mq-${Date.now()}`,
      name: `New Release Queue ${mergeQueues.length + 1}`,
      targetBranch: 'master',
      strategy: 'binary_tree',
      batchSize: 5,
      leafBranches: [],
      isActive: true,
      createdAt: Date.now()
    };
    setMergeQueues(prev => [...prev, newQueue]);
  };

  const deleteMergeQueue = (id: string) => {
    setMergeQueues(prev => prev.map(q => q.id === id ? { ...q, isActive: false } : q));
  };

  const updateQueueConfig = (id: string, updates: Partial<MergeQueueType>) => {
    setMergeQueues(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleMerge = async (prId: string) => {
    if (!user) return;
    const pr = prs.find(p => p.id === prId);
    if (!pr) return;

    // Update PR status
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'merging' } : p));

    try {
      const res = await fetch('/api/merge-queue/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: pr.branch, author: user.displayName })
      });
      const data = await res.json();
      if (res.ok) {
        // Simulate the merge process
        simulateMergeProcess(data.queueId, prId);
      }
    } catch (err) {
      console.error('Error registering merge job:', err);
    }
  };

  const handleBatchMerge = async () => {
    if (!user || selectedPrIds.length === 0) return;
    
    const batchName = `Batch Merge ${new Date().toLocaleTimeString()}`;
    
    // Update all PR statuses
    setPrs(prev => prev.map(p => selectedPrIds.includes(p.id) ? { ...p, status: 'merging' } : p));

    try {
      const res = await fetch('/api/merge-queue/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          branch: `batch-${Date.now()}`, 
          author: user.displayName,
          isBatch: true,
          batchName,
          batchPrIds: selectedPrIds
        })
      });
      const data = await res.json();
      if (res.ok) {
        const currentSelected = [...selectedPrIds];
        setSelectedPrIds([]);
        simulateBatchMergeProcess(data.queueId, currentSelected);
      }
    } catch (err) {
      console.error('Error registering batch merge job:', err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await fetch(`/api/merge-queue/${jobId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const simulateBatchMergeProcess = (jobId: string, prIds: string[]) => {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 5;
      
      let status: MergeJob['status'] = 'queued';
      let logs: string[] = [];

      if (progress === 15) {
        status = 'resolving_conflicts';
        logs = ['AI analyzing cross-PR dependencies...', 'Validating atomic consistency...'];
      } else if (progress === 40) {
        status = 'running_tests';
        logs = ['Executing parallel test suites for all PRs...', 'Verifying integration stability...'];
      } else if (progress === 80) {
        status = 'running_tests';
        logs = ['Final regression check passed.', 'Preparing atomic commit...'];
      } else if (progress === 100) {
        status = 'completed';
        logs = ['Atomic Batch Merge successful!', 'All PRs merged into target branches.'];
        clearInterval(interval);
        
        setPrs(prev => prev.map(p => prIds.includes(p.id) ? { ...p, status: 'merged' } : p));
      }

      try {
        await fetch('/api/merge-queue/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            updates: {
              progress,
              status,
              logs: logs.length > 0 ? logs : undefined // In real app we'd append
            }
          })
        });
      } catch (err) {
        console.error('Error updating batch job:', err);
        clearInterval(interval);
      }
    }, 1500);
  };

  const handleStartMergeCycle = async (queueId: string) => {
    if (!user) return;
    const q = mergeQueues.find(mq => mq.id === queueId);
    if (!q || q.leafBranches.length === 0) return;

    try {
      const res = await fetch('/api/merge-queue/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          branch: `cycle-${queueId}`, 
          author: user.displayName,
          queueId
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (q.strategy === 'binary_tree') {
          simulateBinaryTreeMerge(data.queueId, q.leafBranches, q.targetBranch);
        } else {
          simulateMergeProcess(data.queueId, 'batch');
        }
      }
    } catch (err) {
      console.error('Error starting merge cycle:', err);
    }
  };

  const simulateBinaryTreeMerge = (jobId: string, branches: string[], target: string) => {
    let progress = 0;
    
    const interval = setInterval(async () => {
      progress += 5;
      
      let status: MergeJob['status'] = 'queued';
      let logs: string[] = [];

      if (progress === 10) {
        status = 'resolving_conflicts';
        logs = ['Phase 1: Merging leaf nodes...', ...generateMergeLogs(branches, 0)];
      } else if (progress === 30) {
        status = 'running_tests';
        logs = ['Phase 1 Tests: Validating leaf merges...', 'All leaf tests passed.'];
      } else if (progress === 50) {
        status = 'resolving_conflicts';
        logs = ['Phase 2: Merging intermediate nodes...', ...generateMergeLogs(branches, 1)];
      } else if (progress === 70) {
        status = 'running_tests';
        logs = ['Phase 2 Tests: Validating intermediate stability...', 'Integration tests successful.'];
      } else if (progress === 90) {
        status = 'resolving_conflicts';
        logs = [`Final Phase: Merging into ${target}...`, 'AI resolving final integration conflicts...'];
      } else if (progress === 100) {
        status = 'completed';
        logs = [`Binary Tree Merge Cycle successful!`, `Target branch ${target} is now up to date.`];
        clearInterval(interval);
      }

      try {
        await fetch('/api/merge-queue/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            updates: {
              progress,
              status,
              logs: logs.length > 0 ? logs : undefined
            }
          })
        });
      } catch (err) {
        console.error('Error updating binary tree job:', err);
        clearInterval(interval);
      }
    }, 2000);
  };

  const generateMergeLogs = (branches: string[], level: number) => {
    const logs: string[] = [];
    const step = Math.pow(2, level);
    for (let i = 0; i < branches.length; i += step * 2) {
      if (i + step < branches.length) {
        logs.push(`Merging [${branches[i]}] and [${branches[i + step]}]...`);
      }
    }
    return logs;
  };

  const simulateMergeProcess = (jobId: string, prId: string) => {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 10;
      
      let status: MergeJob['status'] = 'queued';
      let logs: string[] = [];

      if (progress === 20) {
        status = 'resolving_conflicts';
        logs = ['AI analyzing code conflicts...', 'Applying semantic resolution...'];
      } else if (progress === 60) {
        status = 'running_tests';
        logs = ['Executing automated test suite...', 'Analyzing coverage reports...'];
      } else if (progress === 100) {
        status = 'completed';
        logs = ['Merge successful!', 'Updating primary branch...'];
        clearInterval(interval);
        
        if (prId !== 'batch') {
          setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'merged' } : p));
        }
      }

      try {
        await fetch('/api/merge-queue/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            updates: {
              progress,
              status,
              logs: logs.length > 0 ? logs : undefined
            }
          })
        });
      } catch (err) {
        console.error('Error updating merge job:', err);
        clearInterval(interval);
      }
    }, 2000);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <GitBranch className="text-orange-500 animate-pulse" size={48} />
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Initializing GitFlow AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#1C1D21] border border-white/5 rounded-[32px] p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20 ring-1 ring-white/20">
            <GitBranch className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">GitFlow AI</h1>
          <p className="text-white/40 mb-12 leading-relaxed font-medium">
            The intelligent orchestrator for your GitLab and GitHub workflows. Automate merges, resolve conflicts, and scale your productivity.
          </p>
          <div className="space-y-4">
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                <p className="text-rose-500 text-xs font-medium leading-relaxed">{loginError}</p>
              </div>
            )}
            <button
              onClick={() => handleLogin('google')}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all group"
            >
              <LogIn size={20} />
              Sign in with Google
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleLogin('github')}
                className="bg-[#24292e] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#2b3137] transition-all"
              >
                <Github size={20} />
                GitHub
              </button>
              <button
                onClick={() => handleLogin('gitlab')}
                className="bg-[#e24329] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#fc6d26] transition-all"
              >
                <Globe size={20} />
                GitLab
              </button>
            </div>
          </div>
          <p className="mt-8 text-[10px] text-white/20 uppercase tracking-widest font-bold">
            GitLab Hackathon 2026
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0B0D] text-white font-sans overflow-hidden">
      {/* Left Rail - GitFlow AI Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenCLI={() => setIsCLIOpen(true)} />

      {/* Left Frame - GitLab Duo Agent */}
      <div className="w-96 h-full border-r border-white/10 bg-[#151619] z-40 shrink-0 hidden lg:block">
        <GitLabDoAgent />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-white/40">GitLab Hackathon 2026 • AI Productivity Track</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user.displayName?.[0] || 'U'
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{user.displayName}</p>
                    <p className="text-[10px] text-white/40">{user.email}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-white/40 hover:text-orange-500 transition-colors"
                  title="Reload Page"
                >
                  <RefreshCw size={18} />
                </button>
                <div className="h-8 w-px bg-white/10"></div>
                <button 
                  onClick={handleLogout}
                  className="text-white/40 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Banner */}
              <div className="relative h-64 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80" 
                  alt="GitFlow AI Banner" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0D] via-[#0A0B0D]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase mb-3 leading-none">
                      System <span className="text-orange-500">Orchestration</span>
                    </h2>
                    <div className="flex items-center gap-4">
                      <p className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Active Node: <span className="text-emerald-400">US-WEST-1</span>
                      </p>
                      <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Merges', value: stats.totalMerges, icon: GitPullRequest, color: 'text-blue-400' },
                  { label: 'Conflicts Resolved', value: stats.conflictsResolved, icon: Zap, color: 'text-orange-400' },
                  { label: 'Test Success Rate', value: `${stats.testSuccessRate}%`, icon: Activity, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1C1D21] border border-white/5 rounded-3xl p-6 flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <BranchGraph branches={branches.length > 0 ? branches : []} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <GitPullRequest className="text-orange-500" size={20} />
                        Active Pull Requests
                      </h2>
                      <div className="flex items-center gap-4">
                        {selectedPrIds.length > 1 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleBatchMerge}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                          >
                            <GitMerge size={14} />
                            Create Atomic Batch ({selectedPrIds.length})
                          </motion.button>
                        )}
                        <button className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prs.filter(pr => pr.status !== 'merged').map(pr => (
                        <PRCard 
                          key={pr.id} 
                          pr={pr} 
                          onMerge={handleMerge} 
                          isSelected={selectedPrIds.includes(pr.id)}
                          onSelect={(id) => {
                            if (selectedPrIds.includes(id)) {
                              setSelectedPrIds(selectedPrIds.filter(i => i !== id));
                            } else {
                              setSelectedPrIds([...selectedPrIds, id]);
                            }
                          }}
                        />
                      ))}
                      {prs.filter(pr => pr.status !== 'merged').length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                          <p className="text-white/20 text-sm">No active pull requests</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <MergeQueue jobs={queue} onDelete={handleDeleteJob} />
                  
                  <div className="bg-[#1C1D21] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Users size={18} className="text-white/40" />
                      Team Performance
                    </h3>
                    <div className="space-y-4">
                      {teams.map(team => (
                        <div key={team.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white/80">{team.name}</p>
                            <p className="text-[10px] text-white/30">{team.engineers.length} engineers</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-4/5"></div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400">80%</span>
                          </div>
                        </div>
                      ))}
                      {teams.length === 0 && (
                        <p className="text-white/20 text-xs italic">No teams configured</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {teams.map(team => (
                <div key={team.id} className="bg-[#1C1D21] border border-white/5 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                      <Users className="text-white/60" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Active Team</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Engineers</p>
                    <div className="flex flex-wrap gap-2">
                      {team.engineers.map(eng => (
                        <span key={eng} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-white/60">
                          {eng}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Weekly Merges</p>
                      <p className="text-lg font-bold">24</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Success Rate</p>
                      <p className="text-lg font-bold text-emerald-400">96%</p>
                    </div>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/20">No teams found in database</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'branches' && (
            <motion.div
              key="branches"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                    <GitBranch className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">GitLab Branches</h2>
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/40">gitflow-ai</span>
                    </div>
                    <p className="text-white/40 text-sm">All branches currently tracked in the gitflow-ai repository</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('gitlab-sync')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20"
                >
                  <RefreshCw size={18} />
                  Sync with GitLab
                </button>
              </div>
              <div className="bg-[#1C1D21] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Branch Name</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Last Merged</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map(branch => (
                      <tr key={branch.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <GitBranch size={16} className="text-white/40 group-hover:text-orange-500 transition-colors" />
                            <span className="font-mono text-sm">{branch.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                            branch.type === 'master' ? 'bg-orange-500/10 text-orange-500' :
                            branch.type === 'release' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-white/5 text-white/40'
                          }`}>
                            {branch.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-white/40 text-sm">
                          {branch.lastMergedAt ? new Date(branch.lastMergedAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs text-white/60">Healthy</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {branches.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-white/20 italic">
                          No branches found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Merge Orchestration</h2>
                  <p className="text-white/40">Manage and configure your AI-driven merge queues</p>
                </div>
                <button 
                  onClick={createMergeQueue}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Plus size={18} />
                  New Queue
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Active Queues</h3>
                  {mergeQueues.filter(q => q.isActive).map(q => (
                    <div key={q.id} className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6 group hover:border-orange-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                            <Zap className="text-orange-500" size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">{q.name}</h4>
                            <p className="text-xs text-white/40">Target: <span className="font-mono">{q.targetBranch}</span></p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteMergeQueue(q.id)}
                          className="p-2 text-white/20 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Strategy</p>
                          <select 
                            value={q.strategy}
                            onChange={(e) => updateQueueConfig(q.id, { strategy: e.target.value as any })}
                            className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                          >
                            <option value="binary_tree">Binary Tree</option>
                            <option value="fifo">FIFO Batching</option>
                          </select>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Batch Size</p>
                          <input 
                            type="number"
                            value={q.batchSize}
                            onChange={(e) => updateQueueConfig(q.id, { batchSize: parseInt(e.target.value) })}
                            className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                          />
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Priority</p>
                          <select 
                            value={q.priority || 'standard'}
                            onChange={(e) => updateQueueConfig(q.id, { priority: e.target.value as any })}
                            className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                          >
                            <option value="standard">Standard</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Leaf Branches (Merge Order)</p>
                          <div className="group relative">
                            <ShieldCheck size={14} className="text-white/20 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-black border border-white/10 p-3 rounded-xl text-[10px] text-white/60 hidden group-hover:block z-50">
                              The order here determines the binary tree merge sequence. Branches 1 & 2 merge first, then 3 & 4, and so on.
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {q.leafBranches.length > 0 ? q.leafBranches.map((branch, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                              <span className="text-white/30 font-mono">{i + 1}.</span>
                              <span className="text-white/80">{branch}</span>
                            </div>
                          )) : (
                            <p className="text-xs text-white/20 italic">No branches assigned to this queue</p>
                          )}
                          <button className="w-8 h-8 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                        <button 
                          onClick={() => handleStartMergeCycle(q.id)}
                          className="flex-1 bg-white text-black font-bold py-3 rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-sm"
                        >
                          Start Merge Cycle
                        </button>
                        <button className="p-3 bg-white/5 rounded-2xl border border-white/5 text-white/60 hover:text-white transition-colors">
                          <Settings2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {mergeQueues.filter(q => q.isActive).length === 0 && (
                    <div className="py-20 text-center bg-white/5 rounded-[32px] border border-dashed border-white/10">
                      <Zap className="mx-auto text-white/10 mb-4" size={48} />
                      <p className="text-white/30">No active merge queues. Create one to get started.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Live Execution</h3>
                  <MergeQueue jobs={queue} onDelete={handleDeleteJob} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl space-y-8"
            >
              <div className="bg-[#1C1D21] border border-white/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">Workflow Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Merge Frequency</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                      <option>Every 2 Weeks (Bi-weekly)</option>
                      <option>Every Week</option>
                      <option>Daily</option>
                      <option>On Demand</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-sm font-medium">AI Auto-Resolution</p>
                      <p className="text-xs text-white/40">Automatically resolve trivial conflicts using Gemini</p>
                    </div>
                    <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-sm font-medium">Pre-merge Test Suite</p>
                      <p className="text-xs text-white/40">Run full regression tests before final master merge</p>
                    </div>
                    <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <button className="mt-8 w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-orange-500 hover:text-white transition-all">
                  Save Configuration
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'local-cli' && <LocalCLITab />}

          {activeTab === 'judge' && <JudgeView />}
          {activeTab === 'demo' && <DemoView />}
          {activeTab === 'repositories' && <RepoView />}
          {activeTab === 'roadmap' && <RoadmapView />}
          {activeTab === 'project-info' && <ProjectInfo />}
          {activeTab === 'release' && (
            <motion.div
              key="release"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReleaseView 
                branches={branches} 
                onStartSync={(branchName) => {
                  // Simulate master update
                  setBranches(prev => prev.map(b => b.type === 'master' ? { ...b, lastMergedAt: Date.now() } : b));
                }} 
              />
            </motion.div>
          )}
          {activeTab === 'gitlab-sync' && (
            <motion.div
              key="gitlab-sync"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GitLabSyncView />
            </motion.div>
          )}
          {activeTab === 'design' && <DesignDoc />}
        </AnimatePresence>

        {error && (
          <div className="fixed bottom-8 right-8 bg-[#1C1D21] border border-rose-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
            <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle size={18} className="text-rose-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-0.5">System Error</p>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-4">
              <button 
                onClick={() => window.location.reload()} 
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Reload App"
              >
                <RefreshCw size={16} />
              </button>
              <button onClick={() => setError(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      <CLIInterface 
        isOpen={isCLIOpen} 
        onClose={() => setIsCLIOpen(false)} 
        prs={prs}
        queue={queue}
      />
    </div>
  </div>
);
}
