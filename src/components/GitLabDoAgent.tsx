import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Send, Loader2, User, MessageSquare, ShieldAlert, GitPullRequest, Terminal, X, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'summary' | 'security';
}

export const GitLabDoAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm GitLab Duo. I'm here to help you orchestrate your workspace and analyze your code. What can I do for you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "You are GitLab Duo, an advanced AI agent integrated into the GitFlow AI orchestrator. You help developers with code reviews, merge request summaries, security analysis, and workflow automation. Keep your responses concise and professional. Use markdown for code snippets."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "System Error: Failed to connect to Duo Engine. Please check your API configuration." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { id: 'summary', icon: GitPullRequest, label: 'Summarize MR' },
    { id: 'security', icon: ShieldAlert, label: 'Security Scan' },
    { id: 'status', icon: Terminal, label: 'Queue Status' },
  ];

  const runQuickAction = (action: string) => {
    let prompt = "";
    if (action === 'summary') prompt = "Summarize the current active merge request.";
    if (action === 'security') prompt = "Run a security scan on the staged changes.";
    if (action === 'status') prompt = "What is the current status of the merge queue?";
    
    setInput(prompt);
    // Auto-send would be better but let's just set input for now or trigger handleSend
  };

  return (
    <div className="flex flex-col h-full bg-[#151619] border-l border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-[#1C1D21]/50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center ring-1 ring-indigo-500/30">
              <Bot className="text-indigo-500 w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight italic">GitLab Duo</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Agent Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-500/40 w-4 h-4" />
            <button 
              onClick={() => {
                const event = new CustomEvent('toggleAgent', { detail: false });
                window.dispatchEvent(event);
              }}
              className="p-1.5 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-white/10' : 'bg-indigo-500/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="text-white/60" /> : <Bot size={14} className="text-indigo-500" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-indigo-500" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-[#1C1D21]/30">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => runQuickAction(action.id)}
              className="whitespace-nowrap flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              <action.icon size={12} className="text-indigo-500" />
              {action.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Duo anything..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 bottom-3 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="mt-4 text-[8px] text-center text-white/20 uppercase tracking-[0.2em] font-black">
          Powered by Gemini 3.1 Pro
        </p>
      </div>
    </div>
  );
};
