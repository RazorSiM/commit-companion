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
): Promise<string> {
	try {
		messages.start.generating(config.model ?? defaultModel);
		const stream = await getCommitMessage(diff, model, maxLen, semantic);
		if (!stream) {
			throw new Error("Failed to get stream");
		}

		const reader = stream.getReader();
		let buffer = "";
		let message = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += new TextDecoder().decode(value);
			const lines = buffer.split("\n");

			for (let i = 0; i < lines.length - 1; i++) {
				const line = lines[i].trim();
				if (line === "") continue;

				const data = line.replace(/^data: /, "");
				if (data === "[DONE]") {
					return message; // Stream finished, return the accumulated message
				}

				const parsed = JSON.parse(data);
				if (debug) {
					consola.info(parsed);
				}
				const token = parsed.choices[0].delta.content;
				if (token) {
					message += token;
					process.stdout.write(token);
				}
			}
			buffer = lines[lines.length - 1];
		}

		return message;
	} catch (e) {
		messages.error.generic();
		consola.fatal(e);
		throw e;
	}
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
		let message: string;
		message = await generate(
			gitRes.diff,
			config.model ?? defaultModel,
			maxLen,
			semantic,
			args.debug ?? false,
		);
		if (!message) {
			return;
		}

		let regenerate = true;
		while (regenerate) {
			regenerate = await messages.prompt.regenerate();
			if (regenerate) {
				message = await generate(
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
			await commitFiles(message);
			return;
		}
		return;
	},
});
