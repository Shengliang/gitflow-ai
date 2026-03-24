import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Cpu, 
  Layers, 
  GitMerge, 
  Mail, 
  TestTube, 
  ShieldCheck, 
  ChevronRight, 
  Bot,
  Code2,
  Terminal,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Volume2,
  Mic,
  Presentation,
  ChevronLeft,
  Sparkles,
  Timer,
  Zap
} from 'lucide-react';

import { GoogleGenAI, Modality } from "@google/genai";

// Architecture Diagram SVG
const ArchitectureSVG = () => (
  <svg viewBox="0 0 800 500" className="w-full h-auto bg-white/5 rounded-3xl p-8 border border-white/10">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
      </marker>
    </defs>
    
    {/* Users */}
    <rect x="50" y="200" width="100" height="100" rx="10" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="2" />
    <text x="100" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Engineers</text>
    
    {/* Frontend */}
    <rect x="250" y="200" width="120" height="100" rx="10" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" />
    <text x="310" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">React UI</text>
    
    {/* Backend/AI */}
    <rect x="450" y="50" width="150" height="400" rx="10" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
    <text x="525" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI Orchestrator</text>
    <rect x="470" y="100" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="125" textAnchor="middle" fill="white" fontSize="10">Gemini 3.1 Pro</text>
    <rect x="470" y="160" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="185" textAnchor="middle" fill="white" fontSize="10">Merge Queues</text>
    <rect x="470" y="220" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="245" textAnchor="middle" fill="white" fontSize="10">Conflict Resolver</text>
    <rect x="470" y="280" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="305" textAnchor="middle" fill="white" fontSize="10">AI Code Review</text>
    <rect x="470" y="340" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="365" textAnchor="middle" fill="white" fontSize="10">Rebase Engine</text>
    
    {/* External Systems */}
    <rect x="680" y="200" width="100" height="100" rx="10" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="2" />
    <text x="730" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">GitLab / CI</text>
    
    {/* Arrows */}
    <line x1="150" y1="250" x2="250" y2="250" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <line x1="370" y1="250" x2="450" y2="250" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <line x1="600" y1="250" x2="680" y2="250" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    
    {/* Feedback loop */}
    <path d="M 525 450 Q 525 480 310 480 Q 310 300 310 300" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
    <text x="417" y="475" textAnchor="middle" fill="#94a3b8" fontSize="10">Real-time Sync (GitHub API)</text>
  </svg>
);

const MergeStrategiesSVG = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto bg-white/5 rounded-3xl p-8 border border-white/10">
    {/* Mode A: Binary Tree */}
    <text x="200" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Mode A: Binary Tree (Divide & Conquer)</text>
    <g transform="translate(50, 80)">
      {/* Leaves */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={i * 80} y="200" width="60" height="30" rx="5" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
      ))}
      {/* Level 1 Merges */}
      <rect x="40" y="120" width="60" height="30" rx="5" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" />
      <rect x="200" y="120" width="60" height="30" rx="5" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" />
      {/* Root */}
      <rect x="120" y="40" width="60" height="30" rx="5" fill="#f97316" fillOpacity="0.2" stroke="#f97316" />
      
      {/* Connectors */}
      <path d="M 30 200 L 70 150 M 110 200 L 70 150" stroke="#94a3b8" fill="none" />
      <path d="M 190 200 L 230 150 M 270 200 L 230 150" stroke="#94a3b8" fill="none" />
      <path d="M 70 120 L 150 70 M 230 120 L 150 70" stroke="#94a3b8" fill="none" />
    </g>

    {/* Mode B: FIFO Batching */}
    <text x="600" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Mode B: FIFO Batching (Atomic Unions)</text>
    <g transform="translate(450, 80)">
      <rect x="0" y="40" width="300" height="200" rx="10" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.1" strokeDasharray="5,5" />
      <text x="150" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Atomic Union Group</text>
      
      <rect x="20" y="60" width="80" height="30" rx="5" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      <rect x="110" y="60" width="80" height="30" rx="5" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      <rect x="200" y="60" width="80" height="30" rx="5" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      
      <path d="M 150 90 L 150 150" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <rect x="100" y="150" width="100" height="40" rx="5" fill="#f97316" fillOpacity="0.2" stroke="#f97316" />
      <text x="150" y="175" textAnchor="middle" fill="white" fontSize="10">Master Head</text>
    </g>
  </svg>
);

const RebaseCycleSVG = () => (
  <svg viewBox="0 0 800 300" className="w-full h-auto bg-white/5 rounded-3xl p-8 border border-white/10">
    <text x="400" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">The Tag-Based Rebase Cycle</text>
    
    {/* Timeline */}
    <line x1="50" y1="150" x2="750" y2="150" stroke="#94a3b8" strokeWidth="2" />
    
    {/* Tags */}
    <circle cx="100" cy="150" r="6" fill="#f97316" />
    <text x="100" y="180" textAnchor="middle" fill="#f97316" fontSize="10">Tag-X</text>
    
    <circle cx="300" cy="150" r="6" fill="#f97316" />
    <text x="300" y="180" textAnchor="middle" fill="#f97316" fontSize="10">Tag-Y (Merge Point)</text>
    
    {/* Rebase Action */}
    <path d="M 300 150 Q 450 50 600 150" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
    <text x="450" y="80" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">Automated Rebase of Pending PRs</text>
    
    <circle cx="600" cy="150" r="6" fill="#10b981" />
    <text x="600" y="180" textAnchor="middle" fill="#10b981" fontSize="10">New Master Head (Y+1)</text>
    
    <rect x="500" y="220" width="200" height="40" rx="5" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" />
    <text x="600" y="245" textAnchor="middle" fill="white" fontSize="10">Fresh Project Branch Cut</text>
  </svg>
);

const MermaidDiagram = () => (
  <pre className="bg-black/40 p-6 rounded-2xl border border-white/10 font-mono text-xs text-orange-400 overflow-x-auto">
{`graph TD
  A[Engineers] -->|PRs| B(React Frontend)
  B -->|Merge Request| C{AI Orchestrator}
  C -->|Analyze| D[Gemini 3.1 Pro]
  D -->|AI Code Review| C
  D -->|Semantic Conflict Resolution| C
  C -->|Manage| Q[Merge Queues]
  Q -->|Binary Tree / FIFO| E[GitLab API]
  E -->|Test Results| F{CI/CD Pipeline}
  F -->|Success| G[Merge to Master]
  F -->|Failure| H[AI Diagnostics]
  H -->|Notification| A
  C -->|Sync State| GH[(GitHub Repo)]
  GH -->|State Persistence| B`}
  </pre>
);

export const DemoView: React.FC = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAutoAdvance, setIsAutoAdvance] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const slideScripts = [
    "Welcome to GitFlow AI. This is Version 1, our foundational orchestration layer for the GitLab Hackathon 2026. While most AI tools focus on writing code, we focus on the orchestration of the entire SDLC—specifically the high-friction gap between code completion and production deployment. Our mission is to eliminate 'Merge Hell' for large-scale engineering teams.",
    "The core problem we solve is the coordination bottleneck. In organizations with hundreds of engineers, the manual cost of merging dozens of branches into a primary release branch is staggering. This leads to silent semantic bugs and broken CI pipelines. GitFlow AI uses Gemini to understand the intent behind every change, automating the complex logic of large-scale synchronization.",
    "Our architecture acts as a sophisticated intelligence layer between your teams and the GitLab API. We use Gemini 3.1 Pro as our semantic engine to manage merge queues, resolve complex conflicts, and provide real-time diagnostics for test failures. All system state is persisted securely in a GitHub-backed repository, providing a transparent audit trail of every AI-driven decision.",
    "We offer two primary merge strategies. Mode A uses a Binary Tree pairing strategy for massive parallelization, merging branches in concurrent groups. Mode B focuses on system stability through FIFO batching with Atomic Union Groups, ensuring that related changes are tested and merged as a single, verified unit to prevent regression leaks and ensure CI/CD integrity.",
    "Our Tag-Based Rebase Cycle is a game-changer. Unlike manual rebasing which is often delayed, GitFlow AI automatically rebases all pending pull requests onto the new master state immediately after every successful merge. This ensures that developers are always working against the most recent code, resolving conflicts incrementally and keeping the git history clean and linear.",
    "Semantic Conflict Resolution is where Gemini truly shines. Standard git tools only see line-by-line diffs, but GitFlow AI understands the code's logic. If two teams modify the same function, Gemini can intelligently interleave the changes or suggest a resolution that preserves functional intent. We provide four distinct strategies, including automated 'Keep Both' logic and web-based overrides.",
    "The impact is measurable. By automating the merge and rebase cycles, we reduce manual engineering overhead by an estimated 70%. Our 'Mission Control' dashboard provides stakeholders with unprecedented visibility into codebase health, tracking conflict density and merge velocity in real-time. We turn the bi-weekly merge grind into a continuous, AI-verified flow.",
    "Looking ahead, Version 1 is just the beginning. Our roadmap includes AI-driven capacity planning, where the system predicts merge conflicts before they happen. We are also working on 'Predictive CI', using AI to run only the tests most likely to be impacted by a specific change. Thank you for joining us as we redefine software delivery with GitFlow AI."
  ];

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      audioSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsAudioLoading(false);
  };

  const startPresentation = () => {
    setIsPresenting(true);
    setCurrentSlide(0);
  };

  const stopPresentation = () => {
    setIsPresenting(false);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      stopPresentation();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const playSlideAudio = async (index: number) => {
    stopAudio();
    if (isMuted) return;

    setIsAudioLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: slideScripts[index] }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = audioContext;

        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Int16Array(len / 2);
        for (let i = 0; i < len; i += 2) {
          bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
        }

        const float32Data = new Float32Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          float32Data[i] = bytes[i] / 32768.0;
        }

        const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
        buffer.getChannelData(0).set(float32Data);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          setIsAudioLoading(false);
          if (isAutoAdvance && isPresenting) {
            // Small delay before advancing
            setTimeout(() => {
              nextSlide();
            }, 1500);
          }
        };
        source.start();
        audioSourceRef.current = source;
      }
    } catch (err) {
      console.error("Audio generation failed:", err);
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    if (isPresenting && !isMuted) {
      playSlideAudio(currentSlide);
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [currentSlide, isPresenting, isMuted]);

  const slides = [
    {
      title: "GitFlow AI: Version 1",
      subtitle: "The Initial Vision",
      icon: <Sparkles className="text-orange-500" size={32} />,
      description: "This project is the initial Version 1 of the GitFlow AI project submitted for the GitLab Hackathon 2026. It focuses on the core orchestration and merge strategy logic.",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
            <h4 className="font-bold text-orange-500 mb-2">Initial Version</h4>
            <p className="text-sm text-white/60">
              Version 1 establishes the foundational AI-powered merge orchestration, semantic conflict resolution, and automated rebase cycles. This project represents the core logic submitted for the GitLab Hackathon 2026.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The 'Merge Hell' Problem",
      subtitle: "Why GitFlow AI exists",
      icon: <AlertCircle className="text-red-500" size={32} />,
      description: "Large teams struggle with complex merge topologies, silent semantic bugs, and the overhead of manual code reviews. GitFlow AI orchestrates the entire process.",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <h4 className="font-bold text-red-500 mb-2">The Challenge</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex gap-2"><span>•</span> 50+ PRs per day across distributed teams</li>
              <li className="flex gap-2"><span>•</span> Conflicting changes in shared library code</li>
              <li className="flex gap-2"><span>•</span> CI/CD bottlenecks from sequential merging</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "System Architecture",
      subtitle: "Orchestration Layer",
      icon: <Layers className="text-orange-500" size={32} />,
      description: "Our architecture uses Gemini Pro to analyze intent and GitLab API to execute merges safely.",
      content: <ArchitectureSVG />
    },
    {
      title: "Advanced Merge Strategies",
      subtitle: "Mode A & Mode B",
      icon: <GitMerge className="text-orange-500" size={32} />,
      description: "We don't just merge; we orchestrate. Choose between Binary Tree pairing or FIFO Batching with Atomic Union Groups.",
      content: (
        <div className="space-y-6">
          <MergeStrategiesSVG />
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h5 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-2">Mode A</h5>
              <p className="text-xs text-white/60">Binary Tree Pairing for massive parallelization.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h5 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-2">Mode B</h5>
              <p className="text-xs text-white/60">FIFO Batching with Semantic Union Groups.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tag-Based Rebase Cycle",
      subtitle: "Continuous Synchronization",
      icon: <Settings2 className="text-orange-500" size={32} />,
      description: "After every merge, we automatically rebase all pending PRs onto the new base, ensuring developers always work against the latest state.",
      content: <RebaseCycleSVG />
    },
    {
      title: "Semantic Conflict Resolution",
      subtitle: "Beyond Line-by-Line",
      icon: <ShieldCheck className="text-emerald-500" size={32} />,
      description: "Gemini 3.1 Pro understands the intent of your code, offering 4 distinct resolution strategies including 'Keep Both' and 'User Override'.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Prefer A", desc: "Discard source changes.", color: "border-blue-500/30 bg-blue-500/5" },
            { label: "Prefer B", desc: "Discard target changes.", color: "border-orange-500/30 bg-orange-500/5" },
            { label: "Keep Both", desc: "Semantic interleaving.", color: "border-emerald-500/30 bg-emerald-500/5" },
            { label: "Override", desc: "Manual web-IDE fix.", color: "border-purple-500/30 bg-purple-500/5" },
          ].map((opt, i) => (
            <div key={i} className={`p-4 rounded-xl border ${opt.color}`}>
              <p className="font-bold text-white text-sm">{opt.label}</p>
              <p className="text-[10px] text-white/40">{opt.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Impact & Productivity",
      subtitle: "The 70% ROI",
      icon: <Zap className="text-yellow-500" size={32} />,
      description: "We don't just save time; we improve quality. Our 'Mission Control' dashboard gives you real-time visibility into the health of your entire organization.",
      content: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Overhead", value: "-70%", color: "text-emerald-500" },
            { label: "Velocity", value: "+45%", color: "text-blue-500" },
            { label: "Stability", value: "99.9%", color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
          <div className="col-span-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <p className="text-xs text-white/60 leading-relaxed">
              "GitFlow AI transformed our bi-weekly merge nightmare into a continuous, silent background process."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The Future Roadmap",
      subtitle: "Beyond Version 1",
      icon: <Bot className="text-purple-500" size={32} />,
      description: "Predictive conflict detection and AI-driven capacity planning are coming next to the GitFlow AI ecosystem.",
      content: (
        <div className="space-y-4">
          {[
            { title: "Predictive Conflicts", desc: "Detect issues before the PR is even opened." },
            { title: "AI Capacity Planning", desc: "Optimize team assignments based on code density." },
            { title: "Predictive CI", desc: "Run only the tests that matter for a specific change." },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-[10px] text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];


  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs font-bold uppercase tracking-widest">
          <Presentation size={14} />
          Interactive Demo Mode
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white">Experience GitFlow AI <span className="text-orange-500/60 text-2xl align-top ml-2">v1</span></h1>
        <p className="text-white/40 max-w-2xl mx-auto">
          Take a guided tour through our advanced merge orchestration system. This is the **initial Version 1** of the GitFlow AI project.
        </p>
        
        <div className="flex justify-center gap-4">
          {!isPresenting ? (
            <button 
              onClick={startPresentation}
              className="flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 group"
            >
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              Start Presentation
            </button>
          ) : (
            <button 
              onClick={stopPresentation}
              className="flex items-center gap-3 bg-zinc-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all border border-white/10"
            >
              <Square size={20} />
              Exit Presentation
            </button>
          )}
        </div>
      </section>

      <div className="w-full">
        {/* Right Column: Presentation / Overview */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isPresenting ? (
              <motion.div
                key="presentation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#1C1D21] border border-orange-500/20 rounded-[32px] p-8 h-[600px] flex flex-col shadow-2xl shadow-orange-500/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl">
                      {slides[currentSlide].icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Slide {currentSlide + 1} of {slides.length}</p>
                      <h2 className="text-2xl font-bold text-white">{slides[currentSlide].title}</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAutoAdvance(!isAutoAdvance)}
                      className={`p-2 rounded-lg transition-colors ${isAutoAdvance ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                      title={isAutoAdvance ? "Auto-Advance On" : "Auto-Advance Off"}
                    >
                      <Timer size={20} className={isAutoAdvance ? "animate-pulse" : "opacity-40"} />
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <Volume2 className="opacity-40" size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button 
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                    >
                      {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white/80 italic">{slides[currentSlide].subtitle}</h3>
                      <p className="text-white/60 leading-relaxed">{slides[currentSlide].description}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      {slides[currentSlide].content}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-orange-500' : i < currentSlide ? 'bg-orange-500/40' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Architecture */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Layers className="text-orange-500" size={24} />
                    <h2 className="text-2xl font-bold text-white">1. System Architecture</h2>
                  </div>
                  <div className="space-y-4">
                    <ArchitectureSVG />
                    <div className="pt-4">
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Mermaid Definition</p>
                      <MermaidDiagram />
                    </div>
                  </div>
                </section>

                {/* Advanced Merge Strategies */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <GitMerge className="text-orange-500" size={24} />
                    <h2 className="text-2xl font-bold text-white">2. Advanced Merge Orchestration</h2>
                  </div>
                  <div className="space-y-6">
                    <MergeStrategiesSVG />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">Mode A: Binary Tree</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          A "Divide & Conquer" strategy for massive PR volumes. Branches are treated as leaves and merged in pairs iteratively.
                        </p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">Mode B: FIFO Batching</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          Merges PRs in sequential batches. AI identifies **Atomic Union Groups** that must be merged as a single unit.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Rebase Cycle */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings2 className="text-orange-500" size={24} />
                    <h2 className="text-2xl font-bold text-white">3. The Tag-Based Rebase Cycle</h2>
                  </div>
                  <div className="space-y-6">
                    <RebaseCycleSVG />
                    <div className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                      <p className="text-sm text-white/80 leading-relaxed">
                        Automated rebasing ensures developers always work against the latest state, resolving conflicts incrementally.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Creation & Usage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Code2 size={20} />
                      <h3 className="font-bold">4. How it was created</h3>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Built using **React 18**, **Tailwind CSS**, and **Gemini 3.1 Pro** for the orchestration brain.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Terminal size={20} />
                      <h3 className="font-bold">5. How to use the site</h3>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Connect GitLab, select branches, and trigger AI-assisted merges with a single click.
                    </p>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
