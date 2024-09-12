import { defineCommand } from "citty";
import { readConfig } from "../config";
import { messages } from "../consola";
import {
	commitFiles,
	filesReadyToBeStaged,
	getStagedDiff,
	getStagedFiles,
	isGitRepo,
	stageFiles,
} from "../git";
import { getOpenAIStream, printOpenAIStream } from "../sdk";

const config = readConfig();

export const generateCommand = defineCommand({
	meta: {
		name: "generate",
		description: "Generate commit message",
	},
	args: {
		maxLen: {
			type: "string",
			description: "Max length of the commit message",
			alias: "l",
		},
		semantic: {
			type: "boolean",
			description: "Use semantic commit message",
			semantic: "s",
		},
		language: {
			type: "string",
			description: "Preferred language for the commit message",
			alias: "lang",
		},
		debug: {
			type: "boolean",
			description: "Debug mode",
			alias: "d",
		},
	},
	async run({ args }) {
		if (config.backend === "perplexity" && !config.apiKey) {
			messages.fail.missingApiKey();
			return;
		}
		if (!config.model) {
			messages.fail.missingModel();
			return;
		}
		const isGit = await isGitRepo();
		if (!isGit) {
			messages.fail.noGitRepository();
			return;
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
		let message: string | undefined | null;

		const options = {
			diff: gitRes.diff,
			maxLength: maxLen,
			semantic,
			model: config.model,
			language: args.language ?? config.preferredLanguage ?? "english",
		};

		if (!config.url) {
			messages.fail.missingUrl();
			return;
		}

		const stream = await getOpenAIStream({
			baseURL: config.url,
			apiKey: config.apiKey,
			...options,
		});

		message = await printOpenAIStream(stream);

		if (!message) {
			return;
		}

		let regenerate = true;
		while (regenerate) {
			regenerate = await messages.prompt.regenerate();
			if (regenerate) {
				const stream = await getOpenAIStream({
					baseURL: config.url,
					apiKey: config.apiKey,
					...options,
				});
				message = await printOpenAIStream(stream);
			}
		}

		const prompt = await messages.prompt.commitFiles();
		if (prompt && message) {
			await commitFiles(message);
			return;
		}
		return;
	},
});
