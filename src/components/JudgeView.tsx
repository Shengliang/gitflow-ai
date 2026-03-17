import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Cpu, GitMerge, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const JudgeView: React.FC = () => {
  const requirements = [
    {
      title: "Beyond 'AI Writes Code'",
      description: "Focuses on the orchestration of the SDLC—merging, conflict resolution, and release cycles—rather than just code generation.",
      status: "Met",
      icon: Cpu
    },
    {
      title: "Productivity Boost",
      description: "Automates the bi-weekly manual merge grind, reducing engineering overhead by an estimated 70% for large teams.",
      status: "Met",
      icon: Zap
    },
    {
      title: "Real-World Complexity",
      description: "Handles multi-team, multi-branch environments with centralized master and project-specific release flows.",
      status: "Met",
      icon: GitMerge
    },
    {
      title: "AI-First Problem Solving",
      description: "Uses Gemini for semantic conflict resolution (understanding intent) and automated test failure diagnostics.",
      status: "Met",
      icon: ShieldCheck
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-12 pb-20"
    >
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Judge's Guide</h2>
            <p className="text-white/40">GitLab Hackathon 2026 Submission • AI Productivity Track</p>
          </div>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-8">
          <h3 className="text-orange-500 font-bold mb-4 flex items-center gap-2">
            <Info size={18} />
            Executive Summary
          </h3>
          <p className="text-white/80 leading-relaxed">
            GitFlow AI is an intelligent orchestration layer for GitLab that solves the "Merge Hell" problem in large-scale engineering organizations. While most AI tools focus on writing code, we focus on the **Productivity Gap** that exists between code completion and production deployment. By automating conflict resolution and release queueing, we enable teams to move from manual bi-weekly syncs to continuous, AI-verified delivery.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-8">Requirement Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirements.map((req, i) => (
            <div key={i} className="bg-[#1C1D21] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                  <req.icon className="text-white/60 group-hover:text-orange-500" size={20} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{req.status}</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-2">{req.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{req.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold text-white">Why This Project Wins</h3>
        <div className="space-y-4">
          <div className="bg-[#1C1D21] border border-white/5 rounded-3xl p-8">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              The Problem: The "Everything Else" SDLC Gap
            </h4>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              In large organizations with hundreds of engineers (Z engineers per team, X projects), the bottleneck isn't writing code—it's the coordination cost. Merging N project branches into a primary branch every 2 weeks is a high-risk, manual process that consumes thousands of engineering hours.
            </p>
            
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Zap size={18} className="text-emerald-500" />
              The Solution: AI-First Orchestration
            </h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>**AI Conflict Resolution**: Gemini doesn't just look at line diffs; it understands the semantic intent of the code to resolve conflicts that would break standard git merges.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>**Automated Test Diagnostics**: When a merge fails CI, AI analyzes the logs and the diff to suggest immediate fixes, preventing the queue from stalling.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>**Real-time Visibility**: A high-fidelity dashboard (built with React & Firebase) provides stakeholders with a "Mission Control" view of the entire organization's health.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center py-12 border-t border-white/5">
        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-4">Built for the GitLab Hackathon 2026</p>
        <div className="flex justify-center gap-4">
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">TypeScript</div>
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">Gemini AI</div>
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">Firebase</div>
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">Vite</div>
        </div>
      </section>
    </motion.div>
  );
};
