import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  GitMerge, 
  ShieldCheck, 
  Bot, 
  Code2, 
  Terminal,
  Layout,
  Database,
  Globe,
  Settings2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'Core' | 'AI' | 'UI' | 'Infrastructure';
  priority: 'High' | 'Medium' | 'Low';
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Gemini 3.1 Pro Integration',
    description: 'Implement core semantic conflict resolution engine using Gemini 3.1 Pro reasoning capabilities.',
    status: 'completed',
    category: 'AI',
    priority: 'High'
  },
  {
    id: '2',
    title: 'Multimodal Live Presentation',
    description: 'Real-time audio and transcript generation for project demo using Gemini Live API.',
    status: 'completed',
    category: 'AI',
    priority: 'High'
  },
  {
    id: '3',
    title: 'GitHub State Persistence',
    description: 'Implement GitHub repository-backed storage for branches, PRs, and merge jobs to ensure data persistence.',
    status: 'completed',
    category: 'Infrastructure',
    priority: 'High'
  },
  {
    id: '4',
    title: 'GitLab API Orchestrator',
    description: 'Develop Node.js middleware to handle GitLab MR creation, updates, and branch management.',
    status: 'completed',
    category: 'Core',
    priority: 'High'
  },
  {
    id: '5',
    title: 'Binary Tree Merge Strategy',
    description: 'Implement the "Divide & Conquer" merge logic for parallelizing large-scale integrations.',
    status: 'completed',
    category: 'Core',
    priority: 'Medium'
  },
  {
    id: '6',
    title: 'Code Review & Merge Queue CLI',
    description: 'Implement a command-line interface for engineers to manage PRs in the review and merge queues, including status checks and queue manipulation.',
    status: 'completed',
    category: 'Core',
    priority: 'High'
  },
  {
    id: '7',
    title: 'Atomic Batch Merging',
    description: 'Support grouping multiple PRs as an atomic unit for "all or nothing" merging into project branches.',
    status: 'completed',
    category: 'Core',
    priority: 'High'
  },
  {
    id: '8',
    title: 'Priority-Based Merge Queues',
    description: 'Implement high and low priority lanes in the merge queue to expedite critical bug fixes.',
    status: 'completed',
    category: 'Core',
    priority: 'High'
  },
  {
    id: '9',
    title: 'AI-Automated Code Review',
    description: 'Integrate Gemini to automatically address minor review comments and suggest fixes.',
    status: 'completed',
    category: 'AI',
    priority: 'Medium'
  },
  {
    id: '10',
    title: 'Project-to-Master Sync',
    description: 'Automate the final stage of merging project branches into the master branch with full regression validation.',
    status: 'completed',
    category: 'Core',
    priority: 'High'
  }
];

export const RoadmapView: React.FC = () => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'in-progress': return <Clock className="text-orange-500 animate-pulse" size={20} />;
      case 'planned': return <Circle className="text-white/20" size={20} />;
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'Core': return <GitMerge size={14} />;
      case 'AI': return <Bot size={14} />;
      case 'UI': return <Layout size={14} />;
      case 'Infrastructure': return <Database size={14} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="text-orange-500" size={24} />
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">Project Roadmap & Status</h2>
        </div>
        <p className="text-white/40 max-w-2xl">
          Tracking the development of GitFlow AI. Our focus is on building a robust, AI-driven orchestration layer for modern GitLab workflows.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#1C1D21] border border-white/5 rounded-2xl p-6 flex items-start gap-6 group hover:border-orange-500/30 transition-all ${
              task.status === 'completed' ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <div className="mt-1 shrink-0">
              {getStatusIcon(task.status)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest ${
                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                    task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {getCategoryIcon(task.category)}
                    {task.category}
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors">
                <Code2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Future Vision */}
      <section className="bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-12 text-center space-y-6">
        <Globe className="text-orange-500 mx-auto" size={48} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white italic uppercase tracking-tight">The Vision: Autonomous DevOps</h3>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Beyond simple merge orchestration, we are moving towards a system that can autonomously manage entire release cycles, predict integration risks before they happen, and self-heal broken pipelines using Gemini's advanced reasoning.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <div className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/10">
            Phase 1: Orchestration (Current)
          </div>
          <div className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/10">
            Phase 2: Prediction
          </div>
          <div className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/10">
            Phase 3: Autonomy
          </div>
        </div>
      </section>
      {/* Next Task Planning */}
      <section className="bg-[#1C1D21] border border-white/5 rounded-[32px] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Settings2 className="text-orange-500" size={24} />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Next Task Planning</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              Security Hardening
            </h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Finalize and stress-test the GitHub API access controls. Implement "Devil's Advocate" attack vectors to ensure zero unauthorized data access.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              Performance Optimization
            </h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Optimize the real-time branch graph for repositories with 100+ active branches. Implement virtualization for the PR list.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
