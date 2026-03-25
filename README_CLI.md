# GitFlow AI Local CLI (git-ai)

The `git-ai` CLI tool integrates the AI GitFlow directly into your daily terminal workflow.

## Installation

You can install the CLI directly from the hosted orchestrator or download it from GitHub:

- **One-line Install:**
  ```bash
  curl -sL https://gitflow-ai-600965458720.us-west1.run.app/install.sh | bash
  ```

- **Alternative: Install from Source (GitHub):**
  ```bash
  curl -sL https://raw.githubusercontent.com/Shengliang/gitflow-ai/refs/heads/main/public/git-ai.js -o ~/.local/bin/git-ai && chmod +x ~/.local/bin/git-ai
  
  # Then set your orchestrator URL
  git-ai config set APP_URL https://gitflow-ai-600965458720.us-west1.run.app
  ```

- **Direct Download:** [Download CLI SDK (ZIP)](https://github.com/Shengliang/gitflow-ai/archive/refs/heads/main.zip)
- **GitHub Repository:** [https://github.com/Shengliang/gitflow-ai](https://github.com/Shengliang/gitflow-ai)

## Commands

### `git-ai commit`
Analyzes staged files for potential issues before proceeding with the standard git commit.

### `git-ai push`
Pushes the code and automatically registers the branch with the global AI Merge Queue.

### `git-ai rebase`
Runs a standard rebase while the AI monitors for conflict resolution.

### `git-ai cherry-pick <hash|range>`
Analyzes a commit or a range of commits (e.g., `hash1..hash2`) for potential conflicts or logic issues before cherry-picking. If a conflict occurs during the process, the AI will automatically attempt to resolve it.

### `git-ai resolve`
Manually trigger AI conflict resolution for the current repository state. Useful when you encounter conflicts during standard git operations.

### `git-ai clone <repo_uri>`
Clones a repository and automatically configures the AI settings for the project.

### `git-ai sync <dest_repo> <source_repo1> [source_repo2]...`
AI-orchestrated synchronization of multiple source repositories into a destination repository.

### `git-ai queue <add|remove|list|pause|unpause> [branch]`
Directly manage the AI Merge Queue. Pause the queue for maintenance or prioritize specific branches.

### `git-ai reorder <pr_id> <position>`
Change the position of a PR in the merge queue.

### `git-ai atomic_batch <name> <pr_id1> <pr_id2>...`
Group multiple PRs into an atomic batch for synchronized merging.

### `git-ai priority <pr_id> <high|low>`
Set the priority of a PR in the merge queue.

### `git-ai status`
Fetches the global merge queue status directly from the terminal.

### `git-ai benchmark [--with-ai]`
Runs a GitLab API integration benchmark. By default, it runs in cost-saving mode without using Gemini tokens. Use the `--with-ai` flag to enable high-fidelity code review and conflict resolution tests using the Gemini API.

### `git-ai config <set|get|list> [key] [value]`
Manage API keys and local configuration. Keys include `GEMINI_API_KEY`, `GIT_TOKEN`, and `APP_URL`.

### `git-ai version`
Show the current CLI version.

### `git-ai help`
Show the help message with all available commands.

## Fallback
Any other command (e.g., `git-ai checkout`) falls back seamlessly to standard `git`.
