# GitFlow AI Local CLI (git-ai)

The `git-ai` CLI tool integrates the AI GitFlow directly into your daily terminal workflow.

## Installation

Run the following command in your terminal:

```bash
curl -sL https://ais-dev-kxsusitd3wvrmxfiakdr7o-97597776023.us-west1.run.app/install.sh | bash
```

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
