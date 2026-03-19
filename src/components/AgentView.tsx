import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, MessageSquare, ShieldAlert, GitPullRequest, Activity, ChevronRight, Send, Loader2, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AgentView: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'summary' | 'security' | 'chat'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFeatureAction = async (feature: string) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = feature === 'summary' 
        ? "Generate a high-level AI summary of a complex GitLab Merge Request involving 15 files, architectural changes to the auth layer, and new unit tests."
        : "Explain a critical SQL Injection vulnerability found in a Node.js backend and suggest a secure fix using parameterized queries.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      setResult(response.text || "Analysis complete.");
    } catch (err) {
      console.error(err);
      setResult("AI Analysis failed. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
            <Bot className="text-indigo-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">GitLab Duo: AI Agent</h2>
            <p className="text-white/40 text-sm">Advanced AI-powered workspace orchestration and diagnostics</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <Sparkles size={16} className="text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Duo Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'summary', icon: GitPullRequest, label: 'MR Summarizer', desc: 'AI-generated change summaries' },
            { id: 'security', icon: ShieldAlert, label: 'Security Explainer', desc: 'Vulnerability analysis & fixes' },
            { id: 'chat', icon: MessageSquare, label: 'Duo Chat', desc: 'Interactive workspace assistant' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFeature(item.id as any)}
              className={`w-full p-6 rounded-[24px] border transition-all text-left group ${
                activeFeature === item.id
                  ? 'bg-white border-white text-black shadow-xl shadow-white/5'
                  : 'bg-white/5 border-white/5 text-white hover:border-white/20'
              }`}
            >
              <item.icon size={24} className={`mb-4 ${activeFeature === item.id ? 'text-black' : 'text-indigo-500'}`} />
              <h4 className="font-bold text-sm mb-1">{item.label}</h4>
              <p className={`text-[10px] font-medium leading-tight ${activeFeature === item.id ? 'text-black/60' : 'text-white/30'}`}>
                {item.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#1C1D21] border border-white/5 rounded-[40px] p-10 min-h-[600px] flex flex-col"
            >
              {activeFeature === 'summary' && (
                <div className="space-y-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white">Merge Request Summarizer</h3>
                      <p className="text-sm text-white/40">Generate concise, semantic summaries of complex code changes.</p>
                    </div>
                    <button 
                      onClick={() => handleFeatureAction('summary')}
                      disabled={isProcessing}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      Generate Summary
                    </button>
                  </div>

                  <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-8 font-mono text-sm overflow-y-auto">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 size={48} className="text-indigo-500 animate-spin" />
                        <p className="text-white/20 animate-pulse">Duo is analyzing the diff...</p>
                      </div>
                    ) : result ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-400 mb-4">
                          <CheckCircle2 size={18} />
                          <span className="text-xs font-bold uppercase tracking-widest">AI Summary Generated</span>
                        </div>
                        <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                          {result}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <GitPullRequest size={48} className="text-white/5" />
                        <p className="text-white/20 max-w-xs">Select a Merge Request to generate an AI-powered summary of the changes.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeFeature === 'security' && (
                <div className="space-y-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white">Security Explainer</h3>
                      <p className="text-sm text-white/40">Understand vulnerabilities and get AI-suggested remediation.</p>
                    </div>
                    <button 
                      onClick={() => handleFeatureAction('security')}
                      disabled={isProcessing}
                      className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-rose-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                      Explain Vulnerability
                    </button>
                  </div>

                  <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-8 font-mono text-sm overflow-y-auto">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 size={48} className="text-rose-500 animate-spin" />
                        <p className="text-white/20 animate-pulse">Duo is scanning for context...</p>
                      </div>
                    ) : result ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-rose-400 mb-4">
                          <AlertCircle size={18} />
                          <span className="text-xs font-bold uppercase tracking-widest">Security Analysis Complete</span>
                        </div>
                        <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                          {result}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <ShieldAlert size={48} className="text-white/5" />
                        <p className="text-white/20 max-w-xs">Analyze security findings and get actionable remediation steps.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeFeature === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white">Duo Chat</h3>
                    <p className="text-sm text-white/40">Your interactive AI workspace assistant.</p>
                  </div>
                  
                  <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-6 mb-6 overflow-y-auto space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                        <p className="text-sm text-white/80">Hello! I'm GitLab Duo. How can I help you with your workspace today?</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask Duo about your project..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
