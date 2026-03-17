import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, XCircle, AlertCircle, GitMerge } from 'lucide-react';
import { PullRequest } from '../types';

interface PRCardProps {
  pr: PullRequest;
  onMerge: (id: string) => void;
}

export const PRCard: React.FC<PRCardProps> = ({ pr, onMerge }) => {
  const statusConfig = {
    open: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Open' },
    merging: { icon: GitMerge, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Merging...' },
    merged: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Merged' },
    conflict: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Conflict' },
    failed_tests: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', label: 'Tests Failed' },
  };

  const config = statusConfig[pr.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1D21] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold mb-1 group-hover:text-orange-400 transition-colors">
            {pr.title}
          </h3>
          <p className="text-white/40 text-xs font-mono">
            {pr.sourceBranch} → {pr.targetBranch}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${config.bg}`}>
          <config.icon size={14} className={config.color} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white font-bold">
            {pr.author[0].toUpperCase()}
          </div>
          <span className="text-white/60 text-xs">{pr.author}</span>
        </div>
        
        {pr.status === 'open' && (
          <button
            onClick={() => onMerge(pr.id)}
            className="bg-white text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition-all"
          >
            Auto Merge
          </button>
        )}
      </div>
    </motion.div>
  );
};
