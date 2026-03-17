import React from 'react';
import { motion } from 'motion/react';
import { Branch } from '../types';

interface BranchGraphProps {
  branches: Branch[];
}

export const BranchGraph: React.FC<BranchGraphProps> = ({ branches }) => {
  // Simple layout logic for visualization
  const master = branches.find(b => b.type === 'master');
  const projectBranches = branches.filter(b => b.type === 'project');
  const releaseBranches = branches.filter(b => b.type === 'release');

  return (
    <div className="bg-[#1C1D21] border border-white/5 rounded-3xl p-8 overflow-hidden relative min-h-[400px]">
      <div className="absolute top-8 left-8">
        <h2 className="text-white font-bold text-xl mb-1">Branch Topology</h2>
        <p className="text-white/40 text-sm">Visualizing {branches.length} active branches</p>
      </div>

      <svg className="w-full h-full min-h-[300px]" viewBox="0 0 800 400">
        {/* Master Line */}
        <line x1="50" y1="200" x2="750" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Master Node */}
        <circle cx="100" cy="200" r="8" fill="#F97316" />
        <text x="100" y="230" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">master</text>

        {/* Project Branches */}
        {projectBranches.map((branch, i) => {
          const x = 250 + (i * 150);
          const y = 100;
          return (
            <g key={branch.id}>
              <path
                d={`M 100 200 Q 150 100 ${x} 100`}
                fill="none"
                stroke="rgba(249, 115, 22, 0.3)"
                strokeWidth="2"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                cx={x} cy={y} r="6" fill="#F97316"
              />
              <text x={x} y={y - 15} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="medium">
                {branch.name}
              </text>
            </g>
          );
        })}

        {/* Release Branches */}
        {releaseBranches.map((branch, i) => {
          const x = 300 + (i * 200);
          const y = 300;
          return (
            <g key={branch.id}>
              <path
                d={`M 100 200 Q 150 300 ${x} 300`}
                fill="none"
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth="2"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                cx={x} cy={y} r="6" fill="#10B981"
              />
              <text x={x} y={y + 25} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="medium">
                {branch.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-8 right-8 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Primary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Release</span>
        </div>
      </div>
    </div>
  );
};
