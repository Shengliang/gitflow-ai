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
  Mic
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
    <text x="417" y="475" textAnchor="middle" fill="#94a3b8" fontSize="10">Real-time Sync (Firestore)</text>
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
  C -->|Sync State| FB[(Firebase Firestore)]
  FB -->|Real-time Updates| B`}
  </pre>
);

export const DemoView: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: "Hello! I'm the GitFlow AI demo agent. I can explain how our system automates the SDLC, resolves conflicts, and integrates with your workflow. Click 'Start Presentation' for a guided 4-minute tour!" }
  ]);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationStep, setPresentationStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const nextStartTimeRef = useRef<number>(0);

  const handleSend = async (text?: string) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    if (!text) setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are a demo agent for GitFlow AI. 
          Context: Hackathon project for GitLab. 
          User asked: ${userMsg}` }] }
        ]
      });

      setMessages(prev => [...prev, { role: 'bot', content: model.text || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startPresentation = async () => {
    setIsPresenting(true);
    setTranscript([]);
    setMessages(prev => [...prev, { role: 'bot', content: "Starting the 4-minute Live Presentation... Please ensure your volume is up!" }]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Initialize Audio Context for playback
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      nextStartTimeRef.current = audioContextRef.current.currentTime;

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: `You are a professional hackathon presenter for GitFlow AI. 
          Your goal is to deliver a continuous, high-energy, 4-minute monologue presentation for a hackathon recording. 
          DO NOT wait for user input. Speak continuously and thoroughly until you have covered all points in detail.

          Structure your presentation as follows:
          1. Introduction (30s): Introduce yourself as the GitFlow AI Orchestrator. Explain the "Merge Hell" problem in large teams where manual conflict resolution slows down the SDLC.
          2. The Solution & AI Review (45s): Describe how GitFlow AI uses Gemini Pro to orchestrate merges. Highlight our **AI Auto Code Review** feature that runs during the PR process, providing semantic feedback before a merge is even attempted.
          3. Advanced Merge Orchestration (75s): Explain how we handle complex topologies. 
             - For single branches, we manage N individual commits with intelligent squashing and rebase logic.
             - For multi-branch scenarios (e.g., 8 branches to Master), we support two configurable modes:
               * Mode A (Divide & Conquer): A binary tree merge strategy where branches are treated as leaves, merged in pairs iteratively until reaching the root Master branch.
               * Mode B (FIFO Batching): Merging PRs in batches with user-configurable batch sizes.
             - Mention **Atomic Union Groups**: AI can auto-select and group PRs to be merged in an "all-or-nothing" atomic way, ensuring system integrity.
          4. The Tag-Based Rebase Cycle (45s): Explain our precise post-merge synchronization. We use a sophisticated tagging strategy: after merging a range from Tag-X to Tag-Y into Master, we immediately cut a fresh project branch from the new Master head. Then, we orchestrate an automated rebase of all pending PRs from the [Y+1 to current] range onto this new base. This ensures every developer is working against the latest Master state, resolving conflicts incrementally and keeping the next merge cycle clean.
          5. Conflict Resolution Deep Dive (45s): Explain our 4-option semantic resolution strategy (Prefer A, Prefer B, Keep Both, User Override). Mention how we use Gemini to understand the *intent* of the code.
          6. Integration & Safety (30s): Talk about CI/CD integration via webhooks and our "Safety First" policy (no force-pushes, temporary staging branches).
          7. Conclusion (15s): Summarize the impact on productivity and invite judges to explore the dashboard.

          Be enthusiastic, professional, and thorough. Aim for a comprehensive 4-minute presentation.`
        },
        callbacks: {
          onopen: () => {
            sessionPromise.then(session => 
              session.sendRealtimeInput({ text: "Please begin your full 4-minute continuous hackathon presentation now. Cover the advanced merge strategies (Mode A/B), Atomic Union Groups, AI Code Review, and the specific Tag-Based Rebase Cycle workflow in detail. Do not stop until you have finished all sections. Start now." })
            );
          },
          onmessage: async (message) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcmData = new Int16Array(bytes.buffer);
              const float32Data = new Float32Array(pcmData.length);
              for (let i = 0; i < pcmData.length; i++) {
                float32Data[i] = pcmData[i] / 32768.0;
              }

              const audioBuffer = audioContextRef.current!.createBuffer(1, float32Data.length, 24000);
              audioBuffer.getChannelData(0).set(float32Data);

              const source = audioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current!.destination);
              
              const currentTime = audioContextRef.current!.currentTime;
              if (nextStartTimeRef.current < currentTime) {
                nextStartTimeRef.current = currentTime;
              }
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            }
            
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
              const text = message.serverContent.modelTurn.parts[0].text;
              setTranscript(prev => [...prev, text]);
              // Also add to chat messages for context
              setMessages(prev => [...prev, { role: 'bot', content: text }]);
            }
          },
          onclose: () => setIsPresenting(false),
          onerror: (err) => {
            console.error(err);
            setIsPresenting(false);
          }
        }
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsPresenting(false);
      setMessages(prev => [...prev, { role: 'bot', content: "Failed to start live session. Please check your microphone permissions and API key." }]);
    }
  };

  const stopPresentation = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
    }
    setIsPresenting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs font-bold uppercase tracking-widest">
          <Bot size={14} />
          Live Presentation Mode
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white">Experience GitFlow AI</h1>
        <p className="text-white/40 max-w-2xl mx-auto">
          Click the button below to start a 3-minute guided presentation powered by the Gemini Multimodal Live API.
        </p>
        
        <div className="flex justify-center gap-4">
          {!isPresenting ? (
            <button 
              onClick={startPresentation}
              className="flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 group"
            >
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              Start 4-Min Presentation
            </button>
          ) : (
            <button 
              onClick={stopPresentation}
              className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              <Square size={20} />
              Stop Presentation
            </button>
          )}
        </div>
      </section>

      {/* Live Transcript Panel */}
      <AnimatePresence>
        {isPresenting && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900/50 border border-orange-500/20 rounded-[32px] overflow-hidden shadow-2xl shadow-orange-500/5"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Mic className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Live Presentation Transcript</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Real-time AI Monologue • Auto-Scrolling Enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div 
              ref={transcriptRef}
              className="p-8 h-48 overflow-y-auto scroll-smooth space-y-4 font-serif italic text-lg text-zinc-300 leading-relaxed"
            >
              {transcript.length === 0 ? (
                <p className="text-zinc-600 animate-pulse">Waiting for AI to begin speaking...</p>
              ) : (
                transcript.map((text, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-2 border-orange-500/30 pl-4"
                  >
                    {text}
                  </motion.p>
                ))
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Chat Agent */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1C1D21] border border-white/5 rounded-[32px] overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
            {isPresenting && (
              <div className="absolute inset-0 bg-orange-500/5 backdrop-blur-[2px] z-10 pointer-events-none flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, 30, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1 bg-orange-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Live Presenting...</span>
                </div>
              </div>
            )}
            
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Demo Assistant</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    {isPresenting ? 'Live Audio Active' : 'Online • Gemini Pro'}
                  </p>
                </div>
              </div>
              {isPresenting && <Volume2 className="text-orange-500 animate-pulse" size={18} />}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isPresenting ? "Listening..." : "Ask about the architecture..."}
                  disabled={isPresenting}
                  className="w-full bg-[#0A0B0D] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isPresenting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Documentation & Visuals */}
        <div className="lg:col-span-2 space-y-12">
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

          {/* Creation & Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Code2 size={20} />
                <h3 className="font-bold">2. How it was created</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Built using a modern full-stack approach: **React 18** for the reactive UI, **Tailwind CSS** for the brutalist design system, and **Firebase** for real-time state synchronization. The "brain" is powered by **Gemini Pro**, orchestrated via a custom Node.js middleware that handles GitLab API interactions.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Terminal size={20} />
                <h3 className="font-bold">3. How to use the site</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Connect your GitLab account, select your project branches, and configure your merge frequency. The dashboard will automatically track PRs, and you can trigger AI-assisted merges with a single click from the "Active Pull Requests" section.
              </p>
            </section>
          </div>

          {/* Merge Conflict Deep Dive */}
          <section className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-8">
            <div className="flex items-center gap-3">
              <GitMerge className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-white">4. Conflict Resolution Deep Dive</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  5. Policy & Rules
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  Our system follows a "Safety First" policy. AI never force-pushes. Every resolution is staged in a temporary branch for verification. We support **Custom Override Rules** (e.g., "Always prefer Master for CSS files") via the Settings page.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Mail size={18} className="text-orange-500" />
                  6. Email Notifications
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  When Gemini detects a "Semantic Ambiguity" (where intent is unclear), it pauses the merge and triggers a **Firebase Cloud Function** to email the PR author and the Team Lead with a direct link to the manual resolution UI.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h4 className="text-white font-bold mb-6">7. The 4-Option Resolution Strategy</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Option 1", label: "Prefer A", desc: "Discard changes from source branch.", color: "border-blue-500/30 bg-blue-500/5" },
                  { title: "Option 2", label: "Prefer B", desc: "Discard changes from target branch.", color: "border-orange-500/30 bg-orange-500/5" },
                  { title: "Option 3", label: "Keep Both", desc: "Intelligently interleave both changes.", color: "border-emerald-500/30 bg-emerald-500/5" },
                  { title: "Option 4", label: "User Override", desc: "Open the web-based IDE for manual fix.", color: "border-purple-500/30 bg-purple-500/5" },
                ].map((opt, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${opt.color} space-y-2`}>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{opt.title}</p>
                    <p className="font-bold text-white">{opt.label}</p>
                    <p className="text-xs text-white/40 leading-tight">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CI Integration */}
          <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
              <TestTube className="text-white" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">8. Custom Test Integration</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                GitFlow AI exposes a **Generic Webhook API**. You can point your Jenkins, GitHub Actions, or custom shell scripts to our endpoint. We ingest JUnit XML or JSON reports to determine if an AI-resolved merge is safe to land.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
