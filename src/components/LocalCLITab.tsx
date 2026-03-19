import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, ShieldCheck, Zap, GitBranch, GitPullRequest, RefreshCw, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export const LocalCLITab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const installCommand = `curl -sL ${appUrl}/install.sh | bash`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commands = [
    {
      name: 'git-ai commit',
      description: 'Analyzes staged files for potential issues before proceeding with the standard git commit.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      example: 'git-ai commit -m "feat: add auth service"'
    },
    {
      name: 'git-ai push',
      description: 'Pushes the code and automatically registers the branch with the global AI Merge Queue.',
      icon: Zap,
      color: 'text-orange-400',
      example: 'git-ai push origin feature/auth'
    },
    {
      name: 'git-ai rebase',
      description: 'Runs a standard rebase while the AI monitors for conflict resolution.',
      icon: RefreshCw,
      color: 'text-blue-400',
      example: 'git-ai rebase master'
    },
    {
      name: 'git-ai status',
      description: 'Fetches the global merge queue status directly from the terminal.',
      icon: GitPullRequest,
      color: 'text-purple-400',
      example: 'git-ai status'
    },
    {
      name: 'git-ai benchmark',
      description: 'Runs a complete AI GitFlow benchmark using GitLab APIs to verify integration and performance.',
      icon: Activity,
      color: 'text-emerald-400',
      example: 'git-ai benchmark'
    },
    {
      name: 'git-ai help',
      description: 'Shows the help message with all available commands and usage instructions.',
      icon: ShieldCheck,
      color: 'text-white/60',
      example: 'git-ai help'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 max-w-5xl"
    >
      <section className="bg-[#1C1D21] border border-white/5 rounded-[40px] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center ring-1 ring-white/10">
              <Terminal className="text-orange-500" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">Local CLI <span className="text-orange-500">SDK</span></h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Developer Productivity Tooling</p>
            </div>
          </div>

          <p className="text-white/60 text-lg mb-12 max-w-2xl leading-relaxed">
            Integrate the AI GitFlow directly into your daily terminal workflow. Our CLI wrapper intercepts standard Git commands to inject intelligent orchestration.
          </p>

          <div className="space-y-4">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">One-Line Installation</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 font-mono text-sm text-emerald-400 flex items-center justify-between group">
                <span className="truncate">{installCommand}</span>
                <button 
                  onClick={handleCopy}
                  className="text-white/40 hover:text-white transition-colors p-2"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
              <button className="bg-white text-black font-bold px-8 rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap">
                <Download size={18} />
                Download Script
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <GitBranch className="text-orange-500" size={24} />
            Command Reference
          </h3>
          <div className="space-y-4">
            {commands.map((cmd, i) => (
              <div key={i} className="bg-[#1C1D21] border border-white/5 rounded-3xl p-6 group hover:border-white/20 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${cmd.color}`}>
                    <cmd.icon size={20} />
                  </div>
                  <h4 className="font-mono font-bold text-white">{cmd.name}</h4>
                </div>
                <p className="text-sm text-white/40 mb-4 leading-relaxed">{cmd.description}</p>
                <div className="bg-black/30 rounded-xl p-3 font-mono text-xs text-white/60 border border-white/5">
                  $ {cmd.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Terminal className="text-orange-500" size={24} />
            Terminal Mockup
          </h3>
          <div className="bg-[#0A0B0D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              <span className="ml-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">zsh — git-ai status</span>
            </div>
            <div className="p-8 font-mono text-sm space-y-4">
              <div className="flex gap-3">
                <span className="text-emerald-400">➜</span>
                <span className="text-white">git-ai status</span>
              </div>
              <div className="text-white/60 space-y-1">
                <p>📊 Fetching GitFlow AI Merge Queue Status...</p>
                <p className="pt-2">Status: <span className="text-emerald-400">ACTIVE</span></p>
                <p>Queue Size: 3</p>
                <p className="pt-2 text-white/80 font-bold underline">CURRENT JOB:</p>
                <p>  Branch: feature/auth-refactor</p>
                <p>  Status: running_tests</p>
                <p>  Progress: 65%</p>
                <p className="pt-2 text-white/80 font-bold underline">NEXT IN QUEUE:</p>
                <p>  1. fix/ui-bugs</p>
                <p>  2. feat/ai-summarizer</p>
              </div>
              <div className="flex gap-3 pt-4">
                <span className="text-emerald-400">➜</span>
                <span className="text-white animate-pulse">_</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-8">
            <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} />
              Seamless Fallback
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Any command not explicitly handled by <span className="font-mono text-orange-500">git-ai</span> (e.g., <span className="font-mono">checkout</span>, <span className="font-mono">branch</span>, <span className="font-mono">log</span>) falls back seamlessly to standard <span className="font-mono">git</span>. You don't need to switch between tools.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
