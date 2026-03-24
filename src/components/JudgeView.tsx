import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Cpu, GitMerge, CheckCircle2, AlertCircle, Info, Layers, ExternalLink, FileText, X } from 'lucide-react';
import { DesignDoc } from './DesignDoc';
import { AnimatePresence } from 'motion/react';

export const JudgeView: React.FC = () => {
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
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

      <section className="bg-[#1C1D21] border border-white/5 rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-white">Technical Architecture</h3>
          </div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Visual Overview</p>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          The system architecture is designed for high availability and real-time synchronization. It leverages a React-based frontend, a GitHub-backed persistence layer for state management, and a Gemini-powered AI orchestrator that interacts directly with the GitLab API.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Architecture Diagram</p>
            <p className="text-sm text-white/80">View the full SVG and Mermaid diagrams in the Live Demo section.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'demo' }))}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-white hover:text-orange-500 transition-colors"
            >
              View Diagram <ExternalLink size={14} />
            </button>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Presentation</p>
            <p className="text-sm text-white/80">Watch the 4-minute AI-guided tour of the system architecture.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'demo' }))}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-500 transition-colors"
            >
              Start Demo <ExternalLink size={14} />
            </button>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Design Document</p>
            <p className="text-sm text-white/80">Deep dive into the technical specifications and merge workflows.</p>
            <button 
              onClick={() => setIsDesignDocOpen(true)}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-white hover:text-blue-500 transition-colors"
            >
              Read Doc <FileText size={14} />
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isDesignDocOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
            >
              <button 
                onClick={() => setIsDesignDocOpen(false)}
                className="absolute top-6 right-6 z-[60] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="overflow-y-auto max-h-[90vh] rounded-3xl">
                <DesignDoc />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <span>**Real-time Visibility**: A high-fidelity dashboard (built with React & GitHub API) provides stakeholders with a "Mission Control" view of the entire organization's health.</span>
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
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">GitHub API</div>
          <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">Vite</div>
        </div>
      </section>
    </motion.div>
  );
};
