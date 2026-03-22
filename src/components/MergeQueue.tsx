import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Cpu, Loader2, Terminal, Zap, Trash2 } from 'lucide-react';
import { MergeJob } from '../types';

interface MergeQueueProps {
  jobs: MergeJob[];
  onDelete?: (jobId: string) => void;
}

export const MergeQueue: React.FC<MergeQueueProps> = ({ jobs, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Cpu className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">AI Merge Queue</h2>
            <p className="text-white/40 text-sm">Orchestrating {jobs.length} active jobs</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1C1D21] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Bot className="text-white/60 w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm">
                        {job.isBatch ? job.batchName : `Job #${job.id.slice(0, 8)}`}
                      </p>
                      {job.isBatch && (
                        <span className="text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Batch
                        </span>
                      )}
                      {job.priority === 'high' && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                          <Zap size={8} />
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-[10px] font-mono">
                      {job.isBatch ? `${job.batchPrIds?.length} PRs` : `PR: ${job.prId}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {job.status !== 'completed' && job.status !== 'failed' && (
                      <Loader2 className="text-orange-500 animate-spin" size={16} />
                    )}
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-2 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Remove from queue"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 font-mono">
                  <span>PROGRESS</span>
                  <span>{job.progress}%</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={12} className="text-white/40" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Logs</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-[10px]">
                {job.logs.map((log, i) => (
                  <div key={i} className="text-white/60">
                    <span className="text-orange-500/50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {jobs.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Bot className="mx-auto text-white/10 mb-4" size={48} />
          <p className="text-white/30 font-medium">Queue is empty. AI is standing by.</p>
        </div>
      )}
    </div>
  );
};
