import { defineCommand } from "citty";
import { type UserConfiguration, readConfig, updateConfig } from "../config";
import { consola } from "../consola";
import { messages } from "../consola";
import { type SupportedModel, supportedModels } from "../sdk";

export const setupCommand = defineCommand({
	meta: {
		name: "setup",
		description: "Setup commit companion",
	},
	args: {
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
		}
		if (args.apiKey) {
			updateConfig({ api: args.apiKey });
			messages.info.api(args.apiKey);
		}
		if (args.model) {
			if (supportedModels.includes(args.model as SupportedModel)) {
				updateConfig({ model: args.model as SupportedModel });
				messages.info.model(args.model);
			} else {
				messages.fail.invalidModel(args.model);
				const model = await messages.prompt.setModelPrompt();
				updateConfig({ model });
				messages.info.model(model);
			}
		} else {
			let config: UserConfiguration;
			let overwriteApiKey = false;
			let api: string;
			try {
				config = readConfig();
			} catch (e) {
				consola.fatal(e);
				return;
			}
			if (!config.api) {
				api = await messages.prompt.setApiKeyPrompt();
				updateConfig({ api });
			} else {
				overwriteApiKey = await messages.prompt.overwriteApiKeyPrompt();
				if (overwriteApiKey) {
					api = await messages.prompt.setApiKeyPrompt();
					updateConfig({ api });
				} else {
					api = config.api;
				}
			}
			const model = await messages.prompt.setModelPrompt();
			updateConfig({ model });
			messages.info.api(api);
			messages.info.model(model);
			return;
		}
	},
});
