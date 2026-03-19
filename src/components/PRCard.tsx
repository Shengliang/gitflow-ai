import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, XCircle, AlertCircle, GitMerge, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { PullRequest } from '../types';
import { runAIReview, ReviewSuggestion } from '../services/geminiService';

interface PRCardProps {
  pr: PullRequest;
  onMerge: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const PRCard: React.FC<PRCardProps> = ({ pr, onMerge, isSelected, onSelect }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [suggestions, setSuggestions] = useState<ReviewSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const statusConfig = {
    open: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Open' },
    merging: { icon: GitMerge, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Merging...' },
    merged: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Merged' },
    conflict: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Conflict' },
    failed_tests: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', label: 'Tests Failed' },
  };

  const config = statusConfig[pr.status];

  const handleAIReview = async () => {
    setIsReviewing(true);
    try {
      const result = await runAIReview(pr.title, "AI-driven merge orchestration and developer productivity tools.");
      setSuggestions(result);
      setShowSuggestions(true);
    } catch (error) {
      console.error("AI Review failed", error);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1C1D21] border ${isSelected ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-white/5'} rounded-2xl p-5 hover:border-white/10 transition-all group relative`}
    >
      {onSelect && pr.status === 'open' && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(pr.id, e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
          />
        </div>
      )}
      <div className={`flex items-start justify-between mb-4 ${onSelect && pr.status === 'open' ? 'pl-8' : ''}`}>
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white font-bold">
              {pr.author[0].toUpperCase()}
            </div>
            <span className="text-white/60 text-xs">{pr.author}</span>
          </div>
          {pr.status === 'open' && (
            <button
              onClick={handleAIReview}
              disabled={isReviewing}
              className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors disabled:opacity-50"
            >
              <Bot size={12} className={isReviewing ? 'animate-pulse' : ''} />
              {isReviewing ? 'Reviewing...' : 'AI Review'}
            </button>
          )}
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

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-orange-500" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Suggestions</span>
              </div>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <ChevronUp size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-white/40">{s.file}:{s.line}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      s.severity === 'high' ? 'bg-rose-500/10 text-rose-500' :
                      s.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {s.severity}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">{s.suggestion}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
