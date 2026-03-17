import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Globe, Search, Filter, ExternalLink, Star, GitFork, Lock, Unlock, RefreshCw } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  platform: 'github' | 'gitlab';
  description: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  url: string;
  lastUpdated: string;
}

const MOCK_REPOS: Repository[] = [
  {
    id: 'gh-1',
    name: 'gitflow-ai-core',
    full_name: 'shengliang/gitflow-ai-core',
    platform: 'github',
    description: 'The core orchestration engine for semantic git merges.',
    stars: 124,
    forks: 12,
    isPrivate: false,
    url: 'https://github.com/shengliang/gitflow-ai-core',
    lastUpdated: '2026-03-16T10:00:00Z'
  },
  {
    id: 'gl-1',
    name: 'gitlab-hackathon-2026',
    full_name: 'shengliang/gitlab-hackathon-2026',
    platform: 'gitlab',
    description: 'Main repository for the GitLab Hackathon 2026 project.',
    stars: 45,
    forks: 5,
    isPrivate: true,
    url: 'https://gitlab.com/shengliang/gitlab-hackathon-2026',
    lastUpdated: '2026-03-17T02:30:00Z'
  },
  {
    id: 'gh-2',
    name: 'react-semantic-ui',
    full_name: 'shengliang/react-semantic-ui',
    platform: 'github',
    description: 'A collection of AI-ready React components.',
    stars: 89,
    forks: 8,
    isPrivate: false,
    url: 'https://github.com/shengliang/react-semantic-ui',
    lastUpdated: '2026-03-15T18:45:00Z'
  }
];

export const RepoView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'github' | 'gitlab'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredRepos = MOCK_REPOS.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) || 
                         repo.description.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || repo.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Centralized Repositories</h2>
          <p className="text-white/40">Manage your GitHub and GitLab projects in one place</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-white/5 border border-white/10 hover:border-white/30 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync All Repos'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1C1D21] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex bg-[#1C1D21] border border-white/5 rounded-2xl p-1">
          {(['all', 'github', 'gitlab'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                platformFilter === p 
                  ? 'bg-white/10 text-white shadow-lg' 
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Repo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 hover:border-white/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  repo.platform === 'github' ? 'bg-white/5 text-white' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {repo.platform === 'github' ? <Github size={24} /> : <Globe size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{repo.name}</h3>
                    {repo.isPrivate ? (
                      <Lock size={14} className="text-white/20" />
                    ) : (
                      <Unlock size={14} className="text-white/20" />
                    )}
                  </div>
                  <p className="text-xs text-white/40 font-mono">{repo.full_name}</p>
                </div>
              </div>
              <a 
                href={repo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            </div>

            <p className="text-sm text-white/60 mb-8 line-clamp-2 h-10">
              {repo.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/40">
                  <Star size={16} />
                  <span className="text-xs font-bold">{repo.stars}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <GitFork size={16} />
                  <span className="text-xs font-bold">{repo.forks}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/20 uppercase font-bold mb-1">Last Updated</p>
                <p className="text-xs text-white/40">{new Date(repo.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full bg-white/5 border border-white/10 hover:bg-white hover:text-black py-3 rounded-2xl text-sm font-bold transition-all">
                Configure GitFlow AI
              </button>
            </div>
          </motion.div>
        ))}
        {filteredRepos.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[32px] border border-dashed border-white/10">
            <Search className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/30">No repositories found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
