import { defineCommand } from "citty";
import { readConfig, updateConfig } from "../config";
import { consola } from "../consola";
import { SupportedModel, supportedModels } from "../sdk";

const config = readConfig();

const defaultModel = supportedModels[0];

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
			default: defaultModel,
		},
	},
	async run({ args }) {
		if (!args.apiKey && !config.api) {
			consola.fail("You need to set your api key first!");
			return;
		}
		if (args.apiKey) {
			updateConfig({ api: args.apiKey });
			consola.success(`Your api key has been set to ${args.apiKey}!`);
		}
		if (args.model) {
			if (supportedModels.includes(args.model as SupportedModel)) {
				updateConfig({ model: args.model });
				consola.success(`Your model has been set to ${args.model}!`);
			} else {
				consola.fail(
					`The model ${
						args.model
					} is not supported. Supported models are ${supportedModels.join(
						", ",
					)}`,
				);
				updateConfig({ model: defaultModel });
				consola.info(
					`Your model has been automatically set to ${defaultModel}!`,
				);
			}
		} else {
			updateConfig({ model: defaultModel });
			consola.info(`Your model has been set to ${defaultModel}!`);
		}
	},
});
