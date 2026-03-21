# GitFlow AI Local CLI (git-ai)

The `git-ai` CLI tool integrates the AI GitFlow directly into your daily terminal workflow.

## Installation

You can install the CLI directly from the hosted orchestrator or download it from GitHub:

- **One-line Install:**
  ```bash
  curl -sL https://gitflow-ai-883388654208.us-west1.run.app/install.sh | bash
  ```

- **Alternative: Install from Source (GitHub):**
  ```bash
  curl -sL https://raw.githubusercontent.com/Shengliang/gitflow-ai/main/public/git-ai.js -o ~/.local/bin/git-ai && chmod +x ~/.local/bin/git-ai
  
  # Then set your orchestrator URL
  git-ai config set APP_URL https://gitflow-ai-883388654208.us-west1.run.app
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

### `git-ai status`
Fetches the global merge queue status directly from the terminal.

## Fallback
Any other command (e.g., `git-ai checkout`) falls back seamlessly to standard `git`.
