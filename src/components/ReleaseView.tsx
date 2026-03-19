import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck, Activity, CheckCircle2, AlertTriangle, ArrowRight, Loader2, GitMerge, Zap } from 'lucide-react';
import { Branch, MergeJob } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

interface ReleaseViewProps {
  branches: Branch[];
  onStartSync: (branchName: string) => void;
}

export const ReleaseView: React.FC<ReleaseViewProps> = ({ branches, onStartSync }) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'validating' | 'merging' | 'testing' | 'completed' | 'failed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const projectBranches = branches.filter(b => b.type === 'project');

  const handleSync = async () => {
    if (!selectedBranch) return;
    
    setIsSyncing(true);
    setSyncStatus('validating');
    setSyncProgress(10);
    setLogs(['Initiating Project-to-Master Sync...', `Source: ${selectedBranch}`, 'Target: master', 'Phase 1: Pre-sync validation...']);

    // Simulate the process
    setTimeout(() => {
      setSyncStatus('testing');
      setSyncProgress(40);
      setLogs(prev => [...prev, 'Validation passed.', 'Phase 2: Running full regression test suite...', 'AI analyzing integration risks...']);
    }, 2000);

    setTimeout(() => {
      setSyncStatus('merging');
      setSyncProgress(70);
      setLogs(prev => [...prev, 'Regression tests successful.', 'Phase 3: Executing final merge into master...', 'AI resolving minor semantic integration conflicts...']);
    }, 5000);

    setTimeout(() => {
      setSyncStatus('completed');
      setSyncProgress(100);
      setLogs(prev => [...prev, 'Merge successful.', 'Final validation complete.', 'Master branch is now synchronized.']);
      onStartSync(selectedBranch);
    }, 8000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
            <Rocket className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">Project-to-Master Sync</h2>
            <p className="text-white/40 text-sm">Automated final stage integration with full regression validation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Master Guard Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest block">Select Project Branch to Sync</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectBranches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.name)}
                    className={`p-4 rounded-2xl border transition-all text-left group ${
                      selectedBranch === branch.name
                        ? 'bg-white border-white text-black'
                        : 'bg-white/5 border-white/5 text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <GitMerge size={18} className={selectedBranch === branch.name ? 'text-black' : 'text-white/40'} />
                      {selectedBranch === branch.name && <CheckCircle2 size={16} className="text-black" />}
                    </div>
                    <p className="font-bold text-sm truncate">{branch.name}</p>
                    <p className={`text-[10px] uppercase tracking-widest font-bold ${selectedBranch === branch.name ? 'text-black/40' : 'text-white/20'}`}>
                      Project Branch
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-white font-bold">Sync Configuration</h3>
                  <p className="text-xs text-white/40 font-medium">AI-driven validation parameters</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                    Regression Required
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    AI Conflict Resolver
                  </span>
                </div>
              </div>

              <button
                disabled={!selectedBranch || isSyncing}
                onClick={handleSync}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  !selectedBranch || isSyncing
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white shadow-xl shadow-orange-500/10'
                }`}
              >
                {isSyncing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Syncing to Master...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Start Final Sync to Master
                  </>
                )}
              </button>
            </div>
          </div>

          {isSyncing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black border border-white/10 rounded-[32px] overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="text-orange-500 animate-pulse" size={20} />
                    <h3 className="text-white font-bold uppercase tracking-tight">Live Sync Execution</h3>
                  </div>
                  <span className="text-xs font-mono text-white/40">{syncProgress}% COMPLETE</span>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                  />
                </div>

                <div className="bg-[#1C1D21] rounded-2xl p-6 font-mono text-xs space-y-2 max-h-64 overflow-y-auto border border-white/5">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-white/20 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className={log.includes('successful') || log.includes('complete') ? 'text-emerald-400' : 'text-white/60'}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {syncStatus !== 'completed' && syncStatus !== 'failed' && (
                    <div className="flex gap-4 animate-pulse">
                      <span className="text-white/20 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-orange-500">AI processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-6 space-y-6">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Sync Requirements</h3>
            <div className="space-y-4">
              {[
                { label: 'All PRs Merged', status: true },
                { label: 'Unit Tests Passed', status: true },
                { label: 'Security Scan Clear', status: true },
                { label: 'Final Review Approved', status: false },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{req.label}</span>
                  {req.status ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={16} className="text-orange-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">AI Insight</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed italic">
              "Gemini has analyzed the integration path from {selectedBranch || 'project'} to master. Risk level is LOW. 12 potential semantic conflicts identified and pre-resolved."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
