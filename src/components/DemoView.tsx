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
  C -->|Sync State| FB[(Firebase Firestore)]
  FB -->|Real-time Updates| B`}
  </pre>
);

export const DemoView: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: "Hello! I'm the GitFlow AI demo agent. I can explain how our system automates the SDLC, resolves conflicts, and integrates with your workflow. Click 'Start Presentation' for a guided 4-minute tour!" }
  ]);
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are a demo agent for GitFlow AI. 
          Context: Hackathon project for GitLab. 
          User asked: ${userMsg}` }] }
        ]
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (err: any) {
      console.error('Chat Error:', err);
      const isUnavailable = err?.message?.includes('unavailable') || err?.message?.includes('503');
      const errorMessage = isUnavailable 
        ? "The AI service is currently overloaded. Please wait a moment and try again." 
        : "I'm having trouble connecting to my brain right now. Please try again in a few seconds.";
      setMessages(prev => [...prev, { role: 'bot', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startPresentation = async () => {
    setIsPresenting(true);
    setTranscript('');
    setMessages(prev => [...prev, { role: 'bot', content: "Starting the 3-minute Live Presentation... Please ensure your volume is up!" }]);
    
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
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: `You are a professional hackathon presenter for GitFlow AI. 
          Your goal is to deliver a continuous, high-energy, 3-minute monologue presentation for a hackathon recording. 
          DO NOT wait for user input. Speak continuously and thoroughly until you have covered all points in detail.

          Structure your presentation as follows:
          1. Introduction (20s): Introduce yourself as the GitFlow AI Orchestrator. Explain the "Merge Hell" problem in large teams.
          2. The Solution & AI Review (30s): Describe how GitFlow AI uses Gemini Pro to orchestrate merges and highlight AI Auto Code Review.
          3. Advanced Merge Orchestration (60s): Explain complex topologies. 
             - Mode A (Divide & Conquer): Binary tree merge strategy.
             - Mode B (FIFO Batching): Merging PRs in batches.
             - Mention Atomic Union Groups for system integrity.
          4. The Tag-Based Rebase Cycle (30s): Explain the post-merge synchronization strategy using tags and automated rebasing.
          5. Conflict Resolution Deep Dive (25s): Explain the 4-option semantic resolution strategy (Prefer A, Prefer B, Keep Both, User Override).
          6. Integration & Safety (10s): Talk about CI/CD integration and "Safety First" policy.
          7. Conclusion (5s): Summarize impact and invite judges to explore.

          Be enthusiastic, professional, and thorough. Aim for a comprehensive 3-minute presentation.`
        },
        callbacks: {
          onopen: () => {
            sessionPromise.then(session => 
              session.sendRealtimeInput({ text: "Please begin your full 3-minute continuous hackathon presentation now. Cover the advanced merge strategies (Mode A/B), Atomic Union Groups, AI Code Review, and the specific Tag-Based Rebase Cycle workflow in detail. Do not stop until you have finished all sections. Start now." })
            );
          },
          onmessage: async (message) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  setIsSpeaking(true);
                  const base64Audio = part.inlineData.data;
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

                  if (audioContextRef.current) {
                    const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
                    audioBuffer.getChannelData(0).set(float32Data);

                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContextRef.current.destination);
                    
                    const currentTime = audioContextRef.current.currentTime;
                    if (nextStartTimeRef.current < currentTime) {
                      nextStartTimeRef.current = currentTime;
                    }
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                  }
                }
                
                if (part.text) {
                  const text = part.text;
                  setTranscript(prev => prev + text);
                }
              }
            }
            
            if (message.serverContent?.turnComplete) {
              setIsSpeaking(false);
            }

            if (message.serverContent?.interrupted) {
              // Handle interruption if needed
              nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
              setIsSpeaking(false);
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
    } catch (err: any) {
      console.error('Live Session Error:', err);
      setIsPresenting(false);
      const isUnavailable = err?.message?.includes('unavailable') || err?.message?.includes('503');
      const errorMessage = isUnavailable 
        ? "The Multimodal Live service is currently unavailable due to high demand. Please try again in a minute." 
        : "Failed to start live session. Please check your microphone permissions and try again.";
      setMessages(prev => [...prev, { role: 'bot', content: errorMessage }]);
    }
  };

  const stopPresentation = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
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
              className="p-8 h-48 overflow-y-auto scroll-smooth font-serif italic text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap"
            >
              {transcript.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-zinc-600 animate-pulse">Waiting for AI to begin speaking...</p>
                  {isSpeaking && (
                    <p className="text-orange-500/60 text-xs font-sans font-bold uppercase tracking-widest animate-pulse">
                      Audio Stream Active • Generating Transcript...
                    </p>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {transcript}
                  {isSpeaking && <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse" />}
                </motion.div>
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
                    A "Divide & Conquer" strategy for massive PR volumes. Branches are treated as leaves and merged in pairs iteratively. This isolates conflicts to smaller groups and allows parallel CI testing of intermediate states.
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">Mode B: FIFO Batching</h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Merges PRs in sequential batches. AI identifies **Atomic Union Groups**—sets of PRs that are semantically linked and must be merged as a single unit to maintain system integrity.
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
                  After a successful merge from Tag-X to Tag-Y, GitFlow AI immediately cuts a fresh project branch from the new Master head. It then orchestrates an **automated rebase** of all pending PRs onto this new base. This ensures developers are always working against the latest state, resolving conflicts incrementally.
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
                Built using a modern full-stack approach: **React 18** for the reactive UI, **Tailwind CSS** for the brutalist design system, and **Firebase** for real-time state synchronization. The "brain" is powered by **Gemini 3.1 Pro**, orchestrated via a custom Node.js middleware that handles GitLab API interactions and semantic analysis.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Terminal size={20} />
                <h3 className="font-bold">5. How to use the site</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Connect your GitLab account, select your project branches, and configure your merge frequency. The dashboard will automatically track PRs, and you can trigger AI-assisted merges with a single click. Use the **AI Auto Code Review** toggle to get semantic feedback before merging.
              </p>
            </section>
          </div>

          {/* Merge Conflict Deep Dive */}
          <section className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-white">6. Conflict Resolution & Safety</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Safety First Policy
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  AI never force-pushes. Every resolution is staged in a temporary branch for verification. We integrate with **GitLab CI/CD** to ensure that every AI-resolved merge passes all tests before landing in the main branch.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Bot size={18} className="text-orange-500" />
                  Semantic Intent Analysis
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  Gemini 3.1 Pro doesn't just look at lines; it understands the *intent* of the code. It can detect if two changes are logically incompatible even if they don't touch the same lines, preventing "silent" semantic bugs.
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
