---
"@razorsim/commit-companion": major
---

# New Features
This version adds explicit support to Perplexity and Ollama, and also a new backend called `custom`. The `custom` backend allows you to add your own OpenAI API supported backend to Commit Companion. Even though I did not tested it, it's very possible that it will work with GPT API as well.

# Technicalities

- Added support to `perplexity`, `custom` and `ollama` as backends.
- Refactored the `setup` command, now it's more user-friendly.
- Started using the `openai` package to process the requests. This will make the code more maintainable and easier to understand.
