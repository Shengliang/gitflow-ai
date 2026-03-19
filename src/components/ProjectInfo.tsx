import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Github, Globe, Rocket, CheckCircle2, ExternalLink, Scale, User, Calendar } from 'lucide-react';

export const ProjectInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">Project Information</h2>
            <p className="text-white/40 text-sm">GitLab AI Hackathon 2026 Compliance & About</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Open Source Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-orange-500" size={20} />
              <h3 className="text-lg font-bold text-white">Project Overview</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              GitFlow AI is an intelligent orchestrator for GitLab and GitHub workflows. It automates complex merge strategies, resolves semantic conflicts using Gemini 3.1 Pro, and manages bi-weekly release cycles with high-precision AI diagnostics.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Track</p>
                <p className="text-sm font-bold text-white">AI Productivity</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Submission Status</p>
                <p className="text-sm font-bold text-emerald-500">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-orange-500" size={20} />
              <h3 className="text-lg font-bold text-white">License Information</h3>
            </div>
            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Primary License</span>
                <span className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-lg uppercase tracking-widest">MIT License</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">
                "This project is licensed under the MIT License. The full text is available in the root of the repository and detectable at the top of the project page."
              </p>
              <button 
                onClick={() => window.open('https://opensource.org/licenses/MIT', '_blank')}
                className="text-xs text-orange-500 font-bold flex items-center gap-1 hover:underline"
              >
                View License Details <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-6 space-y-6">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Submission Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold">Entrant</p>
                  <p className="text-xs text-white/60">shengliang.song@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold">Deadline</p>
                  <p className="text-xs text-white/60">March 25, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Rocket size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold">Group</p>
                  <p className="text-xs text-white/60">GitLab AI Hackathon</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-white/40" />
                <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold">App URL</p>
                  <p className="text-xs text-white/60 truncate max-w-[180px]">https://ais-pre-kxsusitd3wvrmxfiakdr7o-97597776023.us-west1.run.app</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-6 space-y-6">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Official URLs</h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.open('https://gitlab.com/gitlab-ai-hackathon', '_blank')}
                className="w-full p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Hackathon Group</span>
                </div>
                <ExternalLink size={12} className="text-white/20 group-hover:text-white" />
              </button>
              <button 
                onClick={() => window.open('https://github.com/shengliang/gitflow-ai-core', '_blank')}
                className="w-full p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Github size={14} className="text-white/60" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Core Repository</span>
                </div>
                <ExternalLink size={12} className="text-white/20 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
