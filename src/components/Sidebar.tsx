import React from 'react';
import { GitBranch, GitPullRequest, LayoutDashboard, Settings, Users, Zap, ShieldCheck, Bot, Globe } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'repositories', icon: Globe, label: 'Repositories' },
    { id: 'branches', icon: GitBranch, label: 'Branches' },
    { id: 'prs', icon: GitPullRequest, label: 'Pull Requests' },
    { id: 'teams', icon: Users, label: 'Teams' },
    { id: 'queue', icon: Zap, label: 'Merge Queues' },
    { id: 'demo', icon: Bot, label: 'Live Demo' },
    { id: 'judge', icon: ShieldCheck, label: "Judge's Guide" },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-[#151619] border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <GitBranch className="text-white w-5 h-5" />
          </div>
          <h1 className="text-white font-bold tracking-tight">GitFlow AI</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Next Sync</p>
          <p className="text-white font-mono text-sm">March 24, 2026</p>
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
