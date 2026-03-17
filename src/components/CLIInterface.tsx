import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Command, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CLIInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  prs: any[];
  queue: any[];
}

export const CLIInterface: React.FC<CLIInterfaceProps> = ({ isOpen, onClose, prs, queue }) => {
  const [history, setHistory] = useState<{ type: 'cmd' | 'output' | 'error', content: string }[]>([
    { type: 'output', content: 'GitFlow AI CLI v1.0.4' },
    { type: 'output', content: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1);

    setHistory(prev => [...prev, { type: 'cmd', content: cmd }]);

    switch (baseCmd) {
      case 'help':
        setHistory(prev => [...prev, { type: 'output', content: `
Available Commands:
  status          Check merge queue status
  pause           Suspend automated merge workflow
  unpause         Resume automated merge workflow
  reorder <id> <pos>  Change PR position in queue
  remove <id>     Eject PR from queue
  batch <ids...>  Group PRs into atomic unit
  priority <id> <h|l> Set PR priority
  clear           Clear terminal history
  exit            Close terminal
        ` }]);
        break;
      case 'status':
        const merging = queue.filter(j => j.status !== 'completed').length;
        const total = prs.filter(p => p.status === 'open' || p.status === 'merging').length;
        setHistory(prev => [...prev, { type: 'output', content: `
Merge Queue Status:
  Active Jobs: ${merging}
  PRs in Queue: ${total}
  System State: OPERATIONAL
        ` }]);
        break;
      case 'pause':
        setHistory(prev => [...prev, { type: 'output', content: 'Workflow SUSPENDED. New merge cycles will not start.' }]);
        break;
      case 'unpause':
        setHistory(prev => [...prev, { type: 'output', content: 'Workflow RESUMED. Orchestrator active.' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        onClose();
        break;
      case 'reorder':
      case 'remove':
      case 'batch':
      case 'priority':
        if (args.length === 0) {
          setHistory(prev => [...prev, { type: 'error', content: `Error: Command "${baseCmd}" requires arguments.` }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', content: `Command "${baseCmd}" executed successfully for target: ${args.join(', ')}` }]);
        }
        break;
      default:
        if (cmd.trim()) {
          setHistory(prev => [...prev, { type: 'error', content: `Unknown command: ${baseCmd}` }]);
        }
    }
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed z-[60] bg-[#0A0B0D] border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isMaximized ? 'inset-4 rounded-3xl' : 'bottom-8 right-8 w-[500px] h-[400px] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">GitFlow AI Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-rose-500/10 rounded-md text-white/40 hover:text-rose-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* History */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto scrollbar-hide space-y-1"
      >
        {history.map((item, i) => (
          <div key={i} className={`whitespace-pre-wrap leading-relaxed ${
            item.type === 'cmd' ? 'text-white' : 
            item.type === 'error' ? 'text-rose-400' : 
            'text-white/40'
          }`}>
            {item.type === 'cmd' && <span className="text-orange-500 mr-2">❯</span>}
            {item.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
        <ChevronRight size={14} className="text-orange-500" />
        <input 
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          placeholder="Type a command..."
          className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-white/10"
        />
        <Command size={14} className="text-white/10" />
      </div>
    </motion.div>
  );
};
