# Commit Companion
![Showcase](showcase.gif)

This is a simple CLI tool that gets the git diff of the staged files and generates a commit message through one of the [supported models from Perplexity AI](https://docs.perplexity.ai/docs/model-cards).

Highly inspired by [AI Commits](https://github.com/Nutlope/aicommits), where I get the prompt for the commit message and the diff of the staged files.

## Installation
```bash
npm install -g @razorsim/commit-companion
```

## Usage
After the installation, you can use the command `commit-companion` inside a git repository with staged files.

Before the first usage, you need to run the `setup` command to configure the two options: the Perplexity API key and the model name.
The model name is optional, if you don't provide it, the default model will be used.

Models supported are the ones listed in the [Perplexity AI documentation](https://docs.perplexity.ai/docs/model-cards):
- `sonar-small-chat` (default)
- `sonar-medium-chat`
- `codellama-34b-instruct`
- `mistral-7b-instruct`
- `mixtral-8x7b-instruct`

```bash
# Guided setup
commit-companion setup
# Using arguments
commit-companion setup -k <your Perplexity API key> -m <model name>
```

To generate the commit message:
```bash
commit-companion generate
```

Optionally, you can use the `--semantic` flag if you want to use the semantic commit message format.

```bash
# 
commit-companion generate --semantic
```

## Pitfalls
- The prompt for the commit message is taken from [AI Commits](https://github.com/Nutlope/aicommits), based on GPT. Perplexity AI models are different from GPT, so the prompt might not be the best for the model. I'm working on a better prompt for each model.
- The commit message is generated based on the diff of the staged files. If you have a lot of changes, the commit message might not be the best. I'm working on a better way to generate the commit message.
- It's not possible to use the app without a Perplexity API key. I was thinking about a way to use self-hosted models, but I don't have a solution yet.

## Contributing
If you want to contribute, please open an issue or a pull request. I'm open to suggestions and improvements.

First of all, clone the repository and install the dependencies. The `.nvmrc` file points to the latest `lts-iron`:

```bash
nvm use # or fnm use
corepack install
pnpm install
```

Then, you can run the app in `watch` mode:
```bash
pnpm build:watch
```

You can use biome to lint/check/format the code:
```bash
pnpm biome:check
pnpm biome:format
pnpm biome:lint
```
