import { defineCommand } from "citty";
import {
	type BackendPrompt,
	type UserConfiguration,
	readConfig,
	updateConfig,
} from "../config";
import { consola } from "../consola";
import { messages } from "../consola";
import { OllamaOptions, OpenAIOptions, PerplexityOptions } from "../sdk";

export const setupCommand = defineCommand({
	meta: {
		name: "setup",
		description: "Setup commit companion",
	},
	args: {
		url: {
			type: "string",
			description: "Set the URL of the API (if using ollama backend)",
			alias: "u",
		},
		apiKey: {
			type: "string",
			description: "Set your Perplexity AI API key",
			alias: "k",
		},
		model: {
			type: "string",
			description: "Set your Perplexity AI model",
			alias: "m",
		},
		info: {
			type: "boolean",
			description: "Show current configuration",
			alias: "i",
		},
	},
	async run({ args }) {
		consola.start("Setting up commit companion...");
		if (args.info) {
			const config = readConfig();
			messages.box.config(config);
			return;
		}
		if (args.apiKey) {
			updateConfig({ apiKey: args.apiKey });
			messages.info.apiKey(args.apiKey);
		}

		if (args.model) {
			updateConfig({ model: args.model });
			messages.info.model(args.model);
		}
		if (args.url) {
			updateConfig({ url: args.url });
			messages.info.url(args.url);
		}

		if (!args.apiKey && !args.model && !args.url) {
			let config: UserConfiguration;
			let apiKey: string | undefined;
			let url: string | undefined;
			let model: string | undefined;
			try {
				config = readConfig();
			} catch (e) {
				consola.fatal(e);
				return;
			}

			const backend =
				(await messages.prompt.setBackendPrompt()) as BackendPrompt;
			switch (backend) {
				case "ollama": {
					url = await messages.prompt.setUrlPrompt(OllamaOptions.defaultUrl);
					apiKey = await messages.prompt.setApiKeyPrompt(config.apiKey);
					model = await messages.prompt.setOllamaModelPrompt();
					break;
				}
				case "perplexity": {
					url = await messages.prompt.setUrlPrompt(
						PerplexityOptions.defaultUrl,
					);
					apiKey = await messages.prompt.setApiKeyPrompt(config.apiKey);
					model = await messages.prompt.setPerplexityModelPrompt();
					break;
				}
				case "openai": {
					url = await messages.prompt.setUrlPrompt(OpenAIOptions.defaultUrl);
					apiKey = await messages.prompt.setApiKeyPrompt(config.apiKey);
					model = await messages.prompt.setOpenAiModelPrompt();
					break;
				}
				case "custom": {
					url = await messages.prompt.setUrlPrompt();
					apiKey = await messages.prompt.setApiKeyPrompt();
					model = await messages.prompt.setCustomModelPrompt();
					break;
				}
			}
			if (model === "custom") {
				model = await messages.prompt.setCustomModelPrompt();
			}

			const preferredLanguage = await messages.prompt.preferredLanguagePrompt();

			updateConfig({ model, apiKey, url, backend, preferredLanguage });

			messages.info.backend(backend);
			messages.info.url(url);
			messages.info.apiKey(apiKey ?? "none");
			messages.info.model(model);
			return;
		}
	},
});
