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
  <svg viewBox="0 0 800 400" className="w-full h-auto bg-white/5 rounded-3xl p-8 border border-white/10">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
      </marker>
    </defs>
    
    {/* Users */}
    <rect x="50" y="150" width="100" height="100" rx="10" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="2" />
    <text x="100" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Engineers</text>
    
    {/* Frontend */}
    <rect x="250" y="150" width="120" height="100" rx="10" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" />
    <text x="310" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">React UI</text>
    
    {/* Backend/AI */}
    <rect x="450" y="50" width="150" height="300" rx="10" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
    <text x="525" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI Orchestrator</text>
    <rect x="470" y="100" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="125" textAnchor="middle" fill="white" fontSize="10">Gemini Pro</text>
    <rect x="470" y="160" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="185" textAnchor="middle" fill="white" fontSize="10">Merge Logic</text>
    <rect x="470" y="220" width="110" height="40" rx="5" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
    <text x="525" y="245" textAnchor="middle" fill="white" fontSize="10">Conflict Resolver</text>
    
    {/* External Systems */}
    <rect x="680" y="150" width="100" height="100" rx="10" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="2" />
    <text x="730" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">GitLab / CI</text>
    
    {/* Arrows */}
    <line x1="150" y1="200" x2="250" y2="200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <line x1="370" y1="200" x2="450" y2="200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <line x1="600" y1="200" x2="680" y2="200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
    
    {/* Feedback loop */}
    <path d="M 525 350 Q 525 380 310 380 Q 310 250 310 250" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
    <text x="417" y="375" textAnchor="middle" fill="#94a3b8" fontSize="10">Real-time Updates (Firebase)</text>
  </svg>
);

const MermaidDiagram = () => (
  <pre className="bg-black/40 p-6 rounded-2xl border border-white/10 font-mono text-xs text-orange-400 overflow-x-auto">
{`graph TD
  A[Engineers] -->|PRs| B(React Frontend)
  B -->|Merge Request| C{AI Orchestrator}
  C -->|Analyze| D[Gemini Pro]
  D -->|Resolution| C
  C -->|Execute| E[GitLab API]
  E -->|Test Results| F{CI/CD Pipeline}
  F -->|Success| G[Merge to Master]
  F -->|Failure| H[AI Diagnostics]
  H -->|Notification| A
  C -->|Real-time Sync| B`}
  </pre>
);

export const DemoView: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: "Hello! I'm the GitFlow AI demo agent. I can explain how our system automates the SDLC, resolves conflicts, and integrates with your workflow. Click 'Start Presentation' for a guided 3-minute tour!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationStep, setPresentationStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    setMessages(prev => [...prev, { role: 'bot', content: "Starting the 3-minute Live Presentation... Please ensure your volume is up!" }]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Initialize Audio Context for playback
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: "You are a professional hackathon presenter for GitFlow AI. Your goal is to deliver a high-energy, 3-minute presentation. Cover: 1. The problem of Merge Hell. 2. Our AI Orchestration solution. 3. Semantic conflict resolution with 4 options. 4. CI/CD integration. Keep it concise and engaging."
        },
        callbacks: {
          onopen: () => {
            sessionPromise.then(session => 
              session.sendRealtimeInput({ text: "Start the 3-minute hackathon presentation now. Introduce yourself and the project." })
            );
          },
          onmessage: async (message) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
              
              // Simple PCM playback (in a real app, we'd use a queue for gapless)
              const audioBuffer = await audioContextRef.current!.decodeAudioData(audioData);
              const source = audioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current!.destination);
              source.start();
            }
            
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
              setMessages(prev => [...prev, { role: 'bot', content: message.serverContent!.modelTurn!.parts[0].text! }]);
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
              Start 3-Min Presentation
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
              <h2 className="text-2xl font-bold text-white">0. System Architecture</h2>
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
              <h2 className="text-2xl font-bold text-white">7. Conflict Resolution Deep Dive</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  a) Policy & Rules
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  Our system follows a "Safety First" policy. AI never force-pushes. Every resolution is staged in a temporary branch for verification. We support **Custom Override Rules** (e.g., "Always prefer Master for CSS files") via the Settings page.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Mail size={18} className="text-orange-500" />
                  5. Email Notifications
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  When Gemini detects a "Semantic Ambiguity" (where intent is unclear), it pauses the merge and triggers a **Firebase Cloud Function** to email the PR author and the Team Lead with a direct link to the manual resolution UI.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h4 className="text-white font-bold mb-6">b) The 4-Option Resolution Strategy</h4>
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
              <h3 className="text-xl font-bold text-white">6. Custom Test Integration</h3>
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
