import { defineCommand } from "citty";
import { readConfig, updateConfig } from "../config";
import { consola } from "../consola";
import { getStagedDiff, isGitRepo } from "../git";
import { getCommitMessage, supportedModels } from "../sdk";

const config = readConfig();
const defaultModel = supportedModels[0];

export const generateCommand = defineCommand({
	meta: {
		name: "generate",
		description: "Generate commit message",
	},
	args: {
		maxLen: {
			type: "string",
			description: "Max length of the commit message",
			default: "150",
		},
		debug: {
			type: "boolean",
			description: "Debug mode",
			default: false,
		},
	},
	async run({ args }) {
		if (!config.api) {
			consola.fail("You need to set your api key first!");
			return;
		}
		const isGit = await isGitRepo();
		if (!isGit) {
			consola.fail("This is not a git repository!");
			return;
		}
		if (!config.model) {
			consola.info(`Using default model: ${defaultModel}`);
			updateConfig({ model: defaultModel });
		} else {
			consola.info(`Generating with model: ${config.model}`);
		}

		const maxLen = Number.parseInt(args.maxLen);
		if (maxLen < 0 || Number.isNaN(maxLen)) {
			consola.fail("Invalid maxLen");
			return;
		}

		consola.info("Getting the diff for staged files...");
		const gitRes = await getStagedDiff();
		if (!gitRes) {
			consola.info("No staged files");
			return;
		}
		const sdkRes = await getCommitMessage(gitRes.diff, config.model, maxLen);
		if (sdkRes.choices[0].message.content) {
			consola.success(sdkRes.choices[0].message.content);
			if (args.debug) {
				consola.info(JSON.stringify(sdkRes, null, 2));
			}
		} else {
			consola.fail("Failed to generate commit message");
			if (args.debug) {
				consola.info(JSON.stringify(sdkRes, null, 2));
			}
		}
	},
});
