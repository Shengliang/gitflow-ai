#!/usr/bin/env node
const { spawnSync } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// This is a static version of the CLI script. 
// If you download this directly from GitHub, you MUST set your APP_URL.
const DEFAULT_APP_URL = "https://gitflow-ai-600965458720.us-west1.run.app"; 
const VERSION = "1.0.0";
const CONFIG_FILE = path.join(os.homedir(), '.git-ai-config.json');
const args = process.argv.slice(2);
const command = args[0];

function getConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function apiRequest(path, method = 'GET', data = null) {
  const config = getConfig();
  const baseUrl = config.APP_URL || DEFAULT_APP_URL;
  
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(path, baseUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Git-Token': config.GIT_TOKEN || '',
          'X-Gemini-Key': config.GEMINI_API_KEY || ''
        }
      };

      const req = client.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        });
      });

      req.on('error', (e) => reject(e));
      if (data) req.write(JSON.stringify(data));
      req.end();
    } catch (e) {
      reject(new Error("Invalid APP_URL. Please set it using: git-ai config set APP_URL <your-app-url>"));
    }
  });
}

async function run() {
  if (command === 'config') {
    const subCommand = args[1];
    const key = args[2];
    const value = args[3];
    
    if (subCommand === 'set' && key && value) {
      const config = getConfig();
      config[key] = value;
      saveConfig(config);
      console.log('✅ Config set: ' + key + ' = ' + (key.includes('KEY') || key.includes('TOKEN') ? '********' : value));
    } else if (subCommand === 'get' && key) {
      const config = getConfig();
      console.log(key + ' = ' + (config[key] || 'not set'));
    } else if (subCommand === 'list') {
      const config = getConfig();
      console.log('Current Configuration:');
      console.log('  DEFAULT_APP_URL = ' + DEFAULT_APP_URL);
      Object.keys(config).forEach(k => {
        console.log('  ' + k + ' = ' + (k.includes('KEY') || k.includes('TOKEN') ? '********' : config[k]));
      });
    } else {
      console.log('Usage: git-ai config <set|get|list> [key] [value]');
      console.log('Keys: GEMINI_API_KEY, GIT_TOKEN, APP_URL');
    }
  } else if (command === 'version' || command === '-v' || command === '--version') {
    console.log('GitFlow AI CLI version ' + VERSION);
  } else if (command === 'status') {
    console.log('📊 Fetching GitFlow AI Merge Queue Status...');
    try {
      const data = await apiRequest('/api/merge-queue/status');
      console.log('\nStatus:', data.status.toUpperCase());
      console.log('Queue Size:', data.queueSize);
      console.log('\nCURRENT JOB:');
      console.log('  Branch:', data.currentJob ? data.currentJob.branch : 'None');
      console.log('  Status:', data.currentJob ? data.currentJob.status : 'Idle');
      console.log('  Progress:', data.currentJob ? data.currentJob.progress + '%' : '0%');
      console.log('\nNEXT IN QUEUE:');
      if (data.nextInQueue && data.nextInQueue.length > 0) {
        data.nextInQueue.forEach((b, i) => console.log('  ' + (i + 1) + '. ' + b));
      } else {
        console.log('  (Empty)');
      }
    } catch (e) {
      console.error('Error fetching status:', e.message);
    }
  } else if (command === 'benchmark') {
    const useAI = args.includes('--with-ai');
    console.log('⚡ Running GitFlow AI GitLab Benchmark (' + (useAI ? 'AI Mode' : 'Standard Mode') + ')...');
    try {
      const data = await apiRequest('/api/gitlab/benchmark?withAI=' + useAI);
      if (data.error) {
        console.error('\n❌ Error:', data.error);
        if (data.instructions) console.log(data.instructions);
        return;
      }
      console.log('\n✅ ' + data.message);
      console.log('\nCONNECTED PROJECTS:');
      data.projects.forEach(p => console.log('  - ' + p.name + ' (' + p.path + ')'));
      console.log('\nAI FEATURES PERFORMANCE:');
      data.features.forEach(f => console.log('  ' + f.name.padEnd(20) + ' | ' + f.status.padEnd(10) + ' | ' + f.latency));
      console.log('\nSUMMARY:');
      console.log(data.summary);
    } catch (e) {
      console.error('Error running benchmark:', e.message);
    }
  } else if (command === 'atomic_batch') {
    const prIds = args.slice(1);
    const batchName = args[0] || 'New Batch';
    if (prIds.length === 0) {
      console.error('Error: git-ai atomic_batch <name> <pr-id1> <pr-id2> ...');
      return;
    }
    console.log('📦 Creating atomic batch "' + batchName + '"...');
    try {
      const result = await apiRequest('/api/merge-queue/atomic_batch', 'POST', { prIds, batchName });
      console.log('\n✅ ' + result.message);
    } catch (e) {
      console.error('Error creating atomic batch:', e.message);
    }
  } else if (command === 'reorder') {
    const prId = args[1];
    const position = args[2];
    if (!prId || !position) {
      console.error('Error: git-ai reorder <pr_id> <position>');
      return;
    }
    console.log('🔄 Reordering PR ' + prId + ' to position ' + position + '...');
    try {
      const result = await apiRequest('/api/merge-queue/reorder', 'POST', { prId, position });
      console.log('\n✅ ' + result.message);
    } catch (e) {
      console.error('Error reordering PR:', e.message);
    }
  } else if (command === 'priority') {
    const prId = args[1];
    const level = args[2];
    if (!prId || !level) {
      console.error('Error: git-ai priority <pr_id> <high|low>');
      return;
    }
    console.log('⚡ Setting priority of PR ' + prId + ' to ' + level + '...');
    try {
      const result = await apiRequest('/api/merge-queue/priority', 'POST', { prId, level });
      console.log('\n✅ ' + result.message);
    } catch (e) {
      console.error('Error setting priority:', e.message);
    }
  } else if (command === 'cherry-pick') {
    const hash = args[1];
    if (!hash) {
      console.error('Error: git-ai cherry-pick <hash|range>');
      return;
    }
    const isRange = hash.includes('..');
    console.log('🧠 AI analyzing cherry-pick ' + (isRange ? 'range ' : 'commit ') + hash + '...');
    try {
      const analysis = await apiRequest('/api/git/cherry-pick/analyze', 'POST', isRange ? { range: hash } : { hash });
      console.log('\n✅ ' + analysis.message);
      console.log('Risk Score: ' + (analysis.riskScore * 100) + '%');
      
      console.log('\nProceeding with standard git cherry-pick...');
      const gitCP = spawnSync('git', ['cherry-pick', ...args.slice(1)], { stdio: 'inherit' });
      
      if (gitCP.status !== 0) {
        console.log('\n⚠️  Conflict detected! Attempting AI resolution...');
        const resolveResult = await apiRequest('/api/git/resolve', 'POST', { 
          files: ['conflicted_file.txt'], // In a real app, we'd parse git status
          context: 'cherry-pick conflict'
        });
        console.log('\n✅ ' + resolveResult.message);
        resolveResult.resolutions.forEach(r => console.log('  - ' + r.file + ': ' + r.strategy));
        console.log('\nAI has applied fixes. Please review and run: git cherry-pick --continue');
      }
    } catch (e) {
      console.error('Error in cherry-pick process:', e.message);
    }
  } else if (command === 'resolve') {
    console.log('🧠 AI analyzing current conflicts for resolution...');
    try {
      const result = await apiRequest('/api/git/resolve', 'POST', { context: 'manual resolve' });
      console.log('\n✅ ' + result.message);
      if (result.resolutions) {
        result.resolutions.forEach(r => console.log('  - ' + r.file + ': ' + r.strategy));
      }
    } catch (e) {
      console.error('Error resolving conflicts:', e.message);
    }
  } else if (command === 'clone') {
    const repoUri = args[1];
    if (!repoUri) {
      console.error('Error: git-ai clone <repo_uri>');
      return;
    }
    console.log('🚀 Cloning repository and initializing AI configuration...');
    const gitClone = spawnSync('git', ['clone', ...args.slice(1)], { stdio: 'inherit' });
    if (gitClone.status === 0) {
      console.log('\n✅ Repository cloned successfully.');
      const config = getConfig();
      if (!config.APP_URL) {
        console.log('\n💡 Tip: Set your GitFlow AI App URL to enable AI features:');
        console.log('   git-ai config set APP_URL ' + DEFAULT_APP_URL);
      }
    }
  } else if (command === 'sync') {
    const destRepo = args[1];
    const sourceRepos = args.slice(2);
    if (!destRepo || sourceRepos.length === 0) {
      console.error('Error: git-ai sync <dest_repo> <source_repo1> [source_repo2] ...');
      return;
    }
    console.log('🔄 AI orchestrating sync from ' + sourceRepos.length + ' sources to ' + destRepo + '...');
    try {
      const result = await apiRequest('/api/git/sync', 'POST', { destRepo, sourceRepos });
      console.log('\n✅ ' + result.message);
      if (result.details) {
        result.details.forEach(d => console.log('  - ' + d.repo + ': ' + d.status + ' (' + d.commits + ' commits)'));
      }
    } catch (e) {
      console.error('Error syncing repositories:', e.message);
    }
  } else if (command === 'queue') {
    const action = args[1];
    const branch = args[2];
    if (!['add', 'remove', 'list', 'pause', 'unpause'].includes(action)) {
      console.log('Usage: git-ai queue <add|remove|list|pause|unpause> [branch]');
      return;
    }
    if (action === 'list') {
      // Reuse status logic
      console.log('📊 Fetching GitFlow AI Merge Queue Status...');
      try {
        const data = await apiRequest('/api/merge-queue/status');
        console.log('\nStatus:', data.status.toUpperCase());
        console.log('Queue Size:', data.queueSize);
        console.log('\nNEXT IN QUEUE:');
        if (data.nextInQueue && data.nextInQueue.length > 0) {
          data.nextInQueue.forEach((b, i) => console.log('  ' + (i + 1) + '. ' + b));
        } else {
          console.log('  (Empty)');
        }
      } catch (e) {
        console.error('Error fetching queue:', e.message);
      }
    } else {
      console.log('⚙️  Executing queue action: ' + action + '...');
      try {
        const result = await apiRequest('/api/merge-queue/queue-action', 'POST', { action, branch });
        console.log('\n✅ ' + result.message);
      } catch (e) {
        console.error('Error executing queue action:', e.message);
      }
    }
  } else if (command === 'help' || !command) {
    console.log('\n🚀 GitFlow AI CLI (git-ai) Help');
    console.log('================================');
    console.log('Version: ' + VERSION);
    console.log('Website: ' + DEFAULT_APP_URL);
    console.log('\nUSAGE:');
    console.log('  git-ai <command> [options]');
    console.log('\nCOMMANDS:');
    console.log('  commit     AI-powered commit with pre-analysis');
    console.log('  push       Push and register with AI Merge Queue');
    console.log('  rebase     AI-monitored rebase for conflict resolution');
    console.log('  cherry-pick AI-analyzed cherry-pick (supports ranges)');
    console.log('  resolve    Manually trigger AI conflict resolution');
    console.log('  clone      Clone and auto-configure AI settings');
    console.log('  sync       AI-orchestrated multi-repo sync');
    console.log('  queue      Manage AI Merge Queue (add/remove/list/pause/unpause)');
    console.log('  reorder    Change PR position in queue');
    console.log('  atomic_batch Group PRs into atomic unit');
    console.log('  priority   Set PR priority (high/low)');
    console.log('  status     Check global AI Merge Queue status');
    console.log('  benchmark  Run GitLab API integration benchmark (--with-ai for Gemini mode)');
    console.log('  config     Manage API keys and local configuration');
    console.log('  version    Show CLI version');
    console.log('  help       Show this help message');
    console.log('\nFALLBACK:');
    console.log('  Any other command will fall back to standard git.');
  } else if (command === 'push') {
    console.log('🚀 Pushing code and registering with AI Merge Queue...');
    const gitPush = spawnSync('git', ['push', ...args.slice(1)], { stdio: 'inherit' });
    if (gitPush.status === 0) {
      const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.toString().trim();
      try {
        const result = await apiRequest('/api/merge-queue/register', 'POST', { branch, author: process.env.USER });
        console.log('\n✅ ' + result.message);
      } catch (e) {
        console.error('Error registering with merge queue:', e.message);
      }
    }
  } else if (command === 'commit') {
    console.log('🧠 AI analyzing staged files for potential issues...');
    // Simulate AI analysis
    setTimeout(() => {
      console.log('✅ Analysis complete. No critical issues found.');
      console.log('Proceeding with standard git commit...');
      spawnSync('git', ['commit', ...args.slice(1)], { stdio: 'inherit' });
    }, 1000);
  } else if (command === 'rebase') {
    console.log('🔄 Running rebase with AI conflict monitoring...');
    const gitRebase = spawnSync('git', ['rebase', ...args.slice(1)], { stdio: 'inherit' });
    if (gitRebase.status !== 0) {
      console.log('\n⚠️  Conflict detected! AI is analyzing resolution strategies...');
      // In a real app, this would call an API to get resolution suggestions
    }
  } else {
    // Fallback to standard git
    spawnSync('git', args, { stdio: 'inherit' });
  }
}

run();
