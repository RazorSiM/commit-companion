import { defineCommand } from "citty";
import { readConfig, updateConfig } from "../config";
import { consola, messages } from "../consola";
import {
	commitFiles,
	filesReadyToBeStaged,
	getStagedDiff,
	getStagedFiles,
	isGitRepo,
	stageFiles,
} from "../git";
import { type SupportedModel, getCommitMessage, supportedModels } from "../sdk";

const config = readConfig();
const defaultModel = supportedModels[0];

async function generate(
	diff: string,
	model: SupportedModel,
	maxLen: number,
	semantic: boolean,
	debug: boolean,
) {
	messages.start.generating(config.model ?? defaultModel);
	const sdkRes = await getCommitMessage(diff, model, maxLen, semantic);
	if (sdkRes.choices[0].message.content) {
		messages.success.generated(sdkRes.choices[0].message.content);
		if (debug) {
			consola.log(JSON.stringify(sdkRes, null, 2));
		}
		return sdkRes;
	}
	messages.fail.noMessageGenerated();
	if (debug) {
		consola.info(JSON.stringify(sdkRes, null, 2));
	}
	return;
}

export const generateCommand = defineCommand({
	meta: {
		name: "generate",
		description: "Generate commit message",
	},
	args: {
		maxLen: {
			type: "string",
			description: "Max length of the commit message",
		},
		semantic: {
			type: "boolean",
			description: "Use semantic commit message",
		},
		debug: {
			type: "boolean",
			description: "Debug mode",
		},
	},
	async run({ args }) {
		if (!config.api) {
			messages.fail.missingApiKey();
			return;
		}
		const isGit = await isGitRepo();
		if (!isGit) {
			messages.fail.noGitRepository();
			return;
		}
		if (!config.model) {
			messages.info.defaultModel(defaultModel);
			updateConfig({ model: defaultModel });
		} else {
			messages.info.model(config.model);
		}

		let maxLen: number;
		let semantic: boolean;

		if (!args.maxLen) {
			const prompt = await messages.prompt.setMaxLenPrompt();
			maxLen = Number.parseInt(prompt);
		} else {
			maxLen = Number.parseInt(args.maxLen);
		}

		if (maxLen < 0 || Number.isNaN(maxLen)) {
			messages.fail.invalidMaxLen(args.maxLen);
			return;
		}

		if (args.semantic === undefined) {
			const prompt = await messages.prompt.setSemanticPrompt();
			semantic = prompt;
		} else {
			semantic = args.semantic;
		}

		const areFilesStaged = await getStagedFiles();
		if (!areFilesStaged.length) {
			messages.fail.noStagedFiles();
			const files = await filesReadyToBeStaged();
			if (!files.value.length) {
				messages.fail.noFilesToStage();
				return;
			}
			messages.box.stageFiles(files.raw);
			const prompt = await messages.prompt.stageFiles();
			if (prompt) {
				await stageFiles();
			} else {
				return;
			}
		}
		messages.start.gettingDif();
		const gitRes = await getStagedDiff();
		if (!gitRes) {
			messages.fail.noStagedFiles();
			return;
		}
		let response = await generate(
			gitRes.diff,
			config.model ?? defaultModel,
			maxLen,
			semantic,
			args.debug ?? false,
		);
		if (!response) {
			return;
		}
		let regenerate = true;
		while (regenerate) {
			regenerate = await messages.prompt.regenerate();
			if (regenerate) {
				response = await generate(
					gitRes.diff,
					config.model ?? defaultModel,
					maxLen,
					semantic,
					args.debug ?? false,
				);
			}
		}

		const prompt = await messages.prompt.commitFiles();
		if (prompt) {
			await commitFiles(response);
			return;
		}
		return;
	},
});
