import React, { useState, useRef, useEffect } from 'react';
import {
  auth,
  db,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Send, Loader2, User, MessageSquare, ShieldAlert, GitPullRequest, Terminal, X, ChevronRight } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

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
      
      const getMergeQueueStatus = {
        name: "getMergeQueueStatus",
        parameters: {
          type: Type.OBJECT,
          description: "Get the current status of the AI Merge Queue, including active jobs and queued branches.",
          properties: {}
        }
      };

      const getGitLabProjects = {
        name: "getGitLabProjects",
        parameters: {
          type: Type.OBJECT,
          description: "List the GitLab projects the user has access to.",
          properties: {}
        }
      };

      const syncGitLabRepo = {
        name: "syncGitLabRepo",
        parameters: {
          type: Type.OBJECT,
          description: "Synchronize commits from a GitHub repository to a GitLab repository.",
          properties: {
            githubRepo: { type: Type.STRING, description: "The source GitHub repository (e.g., 'Shengliang/gitflow-ai')" },
            gitlabProjectId: { type: Type.STRING, description: "The target GitLab project ID or path." }
          },
          required: ["githubRepo", "gitlabProjectId"]
        }
      };

      const createGitLabRepo = {
        name: "createGitLabRepo",
        parameters: {
          type: Type.OBJECT,
          description: "Create a new repository on GitLab.",
          properties: {
            name: { type: Type.STRING, description: "The name of the repository to create." },
            description: { type: Type.STRING, description: "A brief description of the repository." }
          },
          required: ["name"]
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "You are GitLab Duo, an advanced AI agent integrated into the GitFlow AI orchestrator. You help developers with code reviews, merge request summaries, security analysis, and workflow automation. Keep your responses concise and professional. Use markdown for code snippets. You have access to real-time data via tools. If a user asks to sync or create a repo, use the appropriate tools.",
          tools: [{ functionDeclarations: [getMergeQueueStatus, getGitLabProjects, syncGitLabRepo, createGitLabRepo] }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        const results = [];
        for (const call of functionCalls) {
          if (call.name === 'getMergeQueueStatus') {
            try {
              const q = query(collection(db, 'mergeQueue'), orderBy('createdAt', 'desc'), limit(10));
              const snapshot = await getDocs(q);
              const queueData = snapshot.docs.map(doc => doc.data());
              results.push({ name: call.name, response: { jobs: queueData } });
            } catch (err) {
              results.push({ name: call.name, response: { error: "Failed to fetch merge queue from Firestore." } });
            }
          } else if (call.name === 'getGitLabProjects') {
            const res = await fetch('/api/gitlab/projects');
            results.push({ name: call.name, response: await res.json() });
          } else if (call.name === 'syncGitLabRepo') {
            const res = await fetch('/api/gitlab/repo/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(call.args)
            });
            results.push({ name: call.name, response: await res.json() });
          } else if (call.name === 'createGitLabRepo') {
            const res = await fetch('/api/gitlab/repo/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(call.args)
            });
            results.push({ name: call.name, response: await res.json() });
          }
        }

        const finalResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            { role: 'user', parts: [{ text: userMessage }] },
            { role: 'assistant', parts: response.candidates[0].content.parts },
            { role: 'user', parts: results.map(r => ({ functionResponse: { name: r.name, response: r.response } })) }
          ],
          config: {
            systemInstruction: "You are GitLab Duo. You have just executed some tools. Summarize the results for the user. If a repo was created or synced, provide the details.",
          }
        });
        setMessages(prev => [...prev, { role: 'assistant', content: finalResponse.text || "I've processed that request." }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that request." }]);
      }
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
    <div className="flex flex-col h-full bg-[#151619] border-r border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-[#151619]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center ring-1 ring-indigo-500/30">
              <Bot className="text-indigo-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-black tracking-tighter italic uppercase text-base">GitLab Duo</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">System Agent Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
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
