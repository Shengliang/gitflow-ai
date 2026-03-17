/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PRCard } from './components/PRCard';
import { MergeQueue } from './components/MergeQueue';
import { BranchGraph } from './components/BranchGraph';
import { JudgeView } from './components/JudgeView';
import { DemoView } from './components/DemoView';
import { Branch, PullRequest, MergeJob, Team } from './types';
import { GitPullRequest, Users, GitBranch, Zap, Activity, ShieldCheck, LogIn, LogOut, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';

// Error Boundary Component
const ErrorDisplay = ({ error }: { error: string }) => {
  let displayError = error;
  try {
    const parsed = JSON.parse(error);
    displayError = `Firestore Error: ${parsed.operationType} at ${parsed.path} - ${parsed.error}`;
  } catch (e) {
    // Not a JSON error
  }

  return (
    <div className="fixed bottom-8 right-8 max-w-md bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-3 items-start animate-in slide-in-from-bottom-4">
      <AlertTriangle className="text-rose-500 shrink-0" size={20} />
      <div>
        <p className="text-rose-500 font-bold text-xs uppercase tracking-widest mb-1">System Error</p>
        <p className="text-white/80 text-sm">{displayError}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [queue, setQueue] = useState<MergeJob[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalMerges: 124,
    conflictsResolved: 42,
    testSuccessRate: 98.5,
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Connection Test
  useEffect(() => {
    if (isAuthReady && user) {
      const testConnection = async () => {
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (error) {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            setError("Firebase connection failed. Please check your configuration.");
          }
        }
      };
      testConnection();
    }
  }, [isAuthReady, user]);

  // Firestore Listeners
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const unsubBranches = onSnapshot(collection(db, 'branches'), (snapshot) => {
      setBranches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'branches'));

    const unsubPRs = onSnapshot(query(collection(db, 'pullRequests'), orderBy('createdAt', 'desc')), (snapshot) => {
      setPrs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PullRequest)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'pullRequests'));

    const unsubQueue = onSnapshot(collection(db, 'mergeJobs'), (snapshot) => {
      setQueue(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MergeJob)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'mergeJobs'));

    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'teams'));

    return () => {
      unsubBranches();
      unsubPRs();
      unsubQueue();
      unsubTeams();
    };
  }, [isAuthReady, user]);

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleMerge = async (prId: string) => {
    if (!user) return;
    const pr = prs.find(p => p.id === prId);
    if (!pr) return;

    try {
      // Update PR status
      await updateDoc(doc(db, 'pullRequests', prId), { status: 'merging' });

      // Create a new merge job
      const jobData = {
        prId: prId,
        status: 'queued',
        progress: 0,
        logs: ['Initializing AI merge orchestrator...', 'Fetching branch metadata...'],
      };

      const jobRef = await addDoc(collection(db, 'mergeJobs'), jobData);

      // Simulate the merge process (in a real app, this would be a backend function)
      simulateMergeProcess(jobRef.id, prId);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'pullRequests/mergeJobs');
    }
  };

  const simulateMergeProcess = (jobId: string, prId: string) => {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 10;
      
      try {
        const jobDoc = doc(db, 'mergeJobs', jobId);
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
          
          await updateDoc(doc(db, 'pullRequests', prId), { status: 'merged' });
          
          setTimeout(async () => {
            // In a real app, we might keep the job history, but for simulation we clean up
            // await deleteDoc(doc(db, 'mergeJobs', jobId));
          }, 3000);
        }

        if (logs.length > 0) {
          // In a real app we'd append to logs, here we just update
          await updateDoc(jobDoc, { 
            progress, 
            status, 
            logs: [...(queue.find(j => j.id === jobId)?.logs || []), ...logs] 
          });
        } else {
          await updateDoc(jobDoc, { progress });
        }
      } catch (err) {
        clearInterval(interval);
        handleFirestoreError(err, OperationType.UPDATE, `mergeJobs/${jobId}`);
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
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <GitBranch className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">GitFlow AI</h1>
          <p className="text-white/40 mb-12 leading-relaxed">
            The intelligent orchestrator for your GitLab workflow. Automate merges, resolve conflicts, and scale your productivity.
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all group"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
          <p className="mt-8 text-[10px] text-white/20 uppercase tracking-widest font-bold">
            GitLab Hackathon 2026
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0B0D] text-white font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
                      <button className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prs.filter(pr => pr.status !== 'merged').map(pr => (
                        <PRCard key={pr.id} pr={pr} onMerge={handleMerge} />
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
                  <MergeQueue jobs={queue} />
                  
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
                          No branches found in database
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

          {activeTab === 'judge' && <JudgeView />}
          {activeTab === 'demo' && <DemoView />}
        </AnimatePresence>

        {error && <ErrorDisplay error={error} />}
        
        {user?.email === 'shengliang.song@gmail.com' && (
          <div className="mt-12 pt-12 border-t border-white/5">
            <button 
              onClick={async () => {
                try {
                  // Seed Branches
                  const branchCol = collection(db, 'branches');
                  await addDoc(branchCol, { name: 'master', type: 'master' });
                  await addDoc(branchCol, { name: 'project-alpha', type: 'project', teamId: 'team-1' });
                  await addDoc(branchCol, { name: 'project-beta', type: 'project', teamId: 'team-2' });
                  await addDoc(branchCol, { name: 'release-v1.0', type: 'release' });

                  // Seed Teams
                  const teamCol = collection(db, 'teams');
                  await addDoc(teamCol, { name: 'Platform Team', engineers: ['Alice', 'Bob', 'Charlie'] });
                  await addDoc(teamCol, { name: 'Product Team', engineers: ['David', 'Eve', 'Frank'] });

                  // Seed PRs
                  const prCol = collection(db, 'pullRequests');
                  await addDoc(prCol, {
                    title: 'feat: implement AI conflict resolution',
                    author: 'Alice',
                    authorUid: 'system',
                    sourceBranch: 'feature/ai-resolver',
                    targetBranch: 'project-alpha',
                    status: 'open',
                    createdAt: Date.now() - 3600000,
                  });
                  
                  alert('Database seeded successfully!');
                } catch (err) {
                  handleFirestoreError(err, OperationType.WRITE, 'seed');
                }
              }}
              className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-orange-500 transition-colors"
            >
              Seed Initial Data (Admin Only)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
