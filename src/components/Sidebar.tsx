import React from 'react';
import { GitBranch, GitPullRequest, LayoutDashboard, Settings, Users, Zap, ShieldCheck, Bot, Globe, ListOrdered, FileText, Terminal, Rocket, Info, Sparkles, RefreshCw } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCLI: () => void;
  isDuoVisible: boolean;
  setIsDuoVisible: (visible: boolean) => void;
  hasUnreadDuo: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenCLI, isDuoVisible, setIsDuoVisible, hasUnreadDuo }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'repositories', icon: Globe, label: 'Repositories' },
    { id: 'branches', icon: GitBranch, label: 'Branches' },
    { id: 'prs', icon: GitPullRequest, label: 'Pull Requests' },
    { id: 'teams', icon: Users, label: 'Teams' },
    { id: 'queue', icon: Zap, label: 'Merge Queues' },
    { id: 'release', icon: Rocket, label: 'Release Sync' },
    { id: 'gitlab-sync', icon: RefreshCw, label: 'GitLab Sync' },
    { id: 'local-cli', icon: Terminal, label: 'Local CLI' },
    { id: 'demo', icon: Bot, label: 'Live Demo' },
    { id: 'roadmap', icon: ListOrdered, label: 'Roadmap' },
    { id: 'design', icon: FileText, label: 'Design Doc' },
    { id: 'project-info', icon: Info, label: 'Project Info' },
    { id: 'judge', icon: ShieldCheck, label: "Judge's Guide" },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 bg-[#151619] border-r border-white/10 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-4 border-b border-white/10 flex justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-indigo-600 rounded-xl flex items-center justify-center ring-1 ring-white/20">
          <GitBranch className="text-white w-6 h-6" />
        </div>
      </div>
      
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`w-full flex items-center justify-center p-3 rounded-xl transition-all relative group ${
              activeTab === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/30 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={22} />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              {item.label}
            </div>
          </button>
        ))}
        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            onClick={() => {
              setIsDuoVisible(!isDuoVisible);
            }}
            title={isDuoVisible ? "Hide GitLab Duo" : "Show GitLab Duo"}
            className={`w-full flex items-center justify-center p-3 rounded-xl transition-all group relative ${
              isDuoVisible ? 'text-indigo-500 bg-indigo-500/10' : 'text-white/30 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bot size={22} />
            {hasUnreadDuo && !isDuoVisible && (
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#151619] animate-pulse"></div>
            )}
            <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              {isDuoVisible ? "Hide GitLab Duo" : "Show GitLab Duo"}
            </div>
          </button>
          <button
            onClick={onOpenCLI}
            title="Terminal CLI"
            className="w-full flex items-center justify-center p-3 rounded-xl text-white/30 hover:bg-white/5 hover:text-white transition-all group relative"
          >
            <Terminal size={22} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Terminal CLI
            </div>
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-white/10 flex justify-center">
        <button 
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};
