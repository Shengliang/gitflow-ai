import React from 'react';
import { motion } from 'motion/react';
import { Branch } from '../types';
import { GitCommit, GitBranch, GitMerge, Zap } from 'lucide-react';

interface BranchGraphProps {
  branches: Branch[];
}

interface CommitNode {
  id: string;
  message: string;
  author: string;
  branch: string;
  x: number;
  y: number;
  color: string;
  isMerge?: boolean;
}

export const BranchGraph: React.FC<BranchGraphProps> = ({ branches }) => {
  // Enhanced visualization logic
  const colors = ['#F97316', '#10B981', '#3B82F6', '#A855F7', '#EC4899'];
  
  const commits: CommitNode[] = [
    { id: 'c1', message: 'Initial commit', author: 'Shengliang', branch: 'master', x: 100, y: 300, color: colors[0] },
    { id: 'c2', message: 'Setup project structure', author: 'Shengliang', branch: 'master', x: 200, y: 300, color: colors[0] },
    { id: 'c3', message: 'feat: add AI core', author: 'Alice', branch: 'project-alpha', x: 300, y: 200, color: colors[2] },
    { id: 'c4', message: 'fix: memory leak', author: 'Bob', branch: 'project-alpha', x: 400, y: 200, color: colors[2] },
    { id: 'c5', message: 'docs: update readme', author: 'Charlie', branch: 'master', x: 500, y: 300, color: colors[0] },
    { id: 'c6', message: 'feat: implement merge queues', author: 'David', branch: 'project-beta', x: 450, y: 400, color: colors[3] },
    { id: 'c7', message: 'Merge project-alpha to master', author: 'GitFlow AI', branch: 'master', x: 600, y: 300, color: colors[0], isMerge: true },
    { id: 'c8', message: 'release: v1.0.0-rc1', author: 'Shengliang', branch: 'release-v1.0', x: 700, y: 100, color: colors[1] },
  ];

  return (
    <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-10 overflow-hidden relative min-h-[500px]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-white font-bold text-2xl tracking-tight italic uppercase">Repository Graph</h2>
          <p className="text-white/40 text-sm">Visualizing gitflow-ai commit topology</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">master</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">feature</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">release</span>
          </div>
        </div>
      </div>

      <div className="relative h-[350px] w-full">
        <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {/* Connection Lines */}
          <path d="M 100 300 L 200 300 L 500 300 L 600 300" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="3" />
          <path d="M 200 300 Q 250 200 300 200 L 400 200 Q 500 200 600 300" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="3" />
          <path d="M 200 300 Q 325 400 450 400" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="3" />
          <path d="M 600 300 Q 650 100 700 100" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="3" />

          {/* Commit Nodes */}
          {commits.map((commit, i) => (
            <g key={commit.id} className="cursor-pointer group">
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                cx={commit.x}
                cy={commit.y}
                r={commit.isMerge ? "10" : "6"}
                fill={commit.color}
                className="filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              />
              {commit.isMerge && (
                <GitMerge x={commit.x - 6} y={commit.y - 6} size={12} className="text-white pointer-events-none" />
              )}
              
              {/* Tooltip-like label */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                <rect x={commit.x - 60} y={commit.y - 50} width="120" height="40" rx="8" fill="#1C1D21" stroke="rgba(255,255,255,0.1)" />
                <text x={commit.x} y={commit.y - 35} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{commit.message}</text>
                <text x={commit.x} y={commit.y - 22} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">{commit.author} • {commit.id}</text>
              </g>

              {/* Branch Label */}
              <text x={commit.x} y={commit.y + 25} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">
                {commit.branch}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating AI Badge */}
        <div className="absolute top-0 right-0 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
          <Zap size={14} className="text-orange-500" />
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">AI Topology Analysis Active</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {commits.slice(-4).map(commit => (
          <div key={commit.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-orange-500">{commit.id}</span>
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-white font-medium line-clamp-1">{commit.message}</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[8px] text-white/60">{commit.author[0]}</span>
              </div>
              <span className="text-[10px] text-white/40">{commit.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
