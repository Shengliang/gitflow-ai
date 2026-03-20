import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Branch } from '../types';
import { GitCommit, GitBranch, GitMerge, Zap, Loader2, AlertCircle } from 'lucide-react';

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

export const BranchGraph: React.FC<BranchGraphProps> = ({ branches: initialBranches }) => {
  const [commits, setCommits] = useState<CommitNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('gitflow-ai');
  
  const colors = ['#F97316', '#10B981', '#3B82F6', '#A855F7', '#EC4899'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get projects to find the first one
        const projectsRes = await fetch('/api/gitlab/projects');
        const projectsData = await projectsRes.json();
        
        if (!projectsRes.ok) throw new Error(projectsData.error || 'Failed to fetch projects');
        
        if (projectsData.repositories && projectsData.repositories.length > 0) {
          const project = projectsData.repositories[0];
          setProjectName(project.name);
          const projectId = project.id.replace('gl-', '');
          
          // 2. Fetch commits for this project
          const commitsRes = await fetch(`/api/gitlab/projects/${projectId}/commits`);
          const commitsData = await commitsRes.json();
          
          if (!commitsRes.ok) throw new Error(commitsData.error || 'Failed to fetch commits');
          
          if (commitsData.commits) {
            const branchMap: Record<string, number> = {};
            let branchCount = 0;

            const mappedCommits = commitsData.commits.map((c: any, i: number) => {
              if (branchMap[c.branch] === undefined) {
                branchMap[c.branch] = branchCount++;
              }
              
              const branchIndex = branchMap[c.branch];
              const x = 100 + (i * 70);
              const y = 300 - (branchIndex * 80);
              
              return {
                id: c.id,
                message: c.message,
                author: c.author,
                branch: c.branch,
                x,
                y,
                color: colors[branchIndex % colors.length],
                isMerge: c.message.toLowerCase().includes('merge')
              };
            });
            
            setCommits(mappedCommits.reverse()); // Reverse to show timeline correctly
          }
        } else {
          setError('No GitLab projects found. Please create one or check your token.');
        }
      } catch (err: any) {
        console.error('Error fetching GitLab data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-10 min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Syncing GitLab Topology...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-10 min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-white font-bold">GitLab Integration Error</h3>
          <p className="text-white/40 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-10 overflow-hidden relative min-h-[500px]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-white font-bold text-2xl tracking-tight italic uppercase">Repository Graph</h2>
          <p className="text-white/40 text-sm">Visualizing {projectName} commit topology</p>
        </div>
        <div className="flex gap-4">
          {Array.from(new Set(commits.map(c => c.branch))).slice(0, 3).map((branch, i) => (
            <div key={branch} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{branch}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[350px] w-full overflow-x-auto custom-scrollbar">
        <svg className="h-full" width={Math.max(800, commits.length * 80)} viewBox={`0 0 ${Math.max(800, commits.length * 80)} 500`} preserveAspectRatio="xMidYMid meet">
          {/* Connection Lines (Simplified) */}
          {commits.map((commit, i) => {
            if (i === 0) return null;
            const prev = commits[i - 1];
            return (
              <line 
                key={`line-${commit.id}`}
                x1={prev.x} y1={prev.y}
                x2={commit.x} y2={commit.y}
                stroke={commit.color}
                strokeWidth="2"
                strokeOpacity="0.2"
              />
            );
          })}

          {/* Commit Nodes */}
          {commits.map((commit, i) => (
            <g key={commit.id} className="cursor-pointer group">
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
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
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={commit.x - 60} y={commit.y - 50} width="120" height="40" rx="8" fill="#1C1D21" stroke="rgba(255,255,255,0.1)" />
                <text x={commit.x} y={commit.y - 35} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{commit.message.length > 20 ? commit.message.substring(0, 17) + '...' : commit.message}</text>
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
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Live GitLab Integration</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {commits.slice(-4).map(commit => (
          <div key={commit.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-orange-500">{commit.id}</span>
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">RECENT</span>
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
