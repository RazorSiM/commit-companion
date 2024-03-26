import { createConsola } from "consola";
import { supportedModels } from "./sdk";

export const consola = createConsola({
	fancy: true,
	formatOptions: {
		showTime: true,
		colors: true,
		compact: false,
		columns: 100,
		date: true,
	},
});

async function overwriteApiKeyPrompt() {
	return await consola.prompt(
		"Would you like to overwrite your current API key?",
		{
			type: "confirm",
			initial: false,
		},
	);
}

async function setApiKeyPrompt() {
	return await consola.prompt("Enter your Perplexity AI API key:", {
		type: "text",
		placeholder: "API key",
	});
}

async function setModelPrompt() {
	return await consola.prompt("Please choose one of the `following models`:", {
		type: "select",
		options: [...supportedModels],
	});
}

async function setSemanticPrompt() {
	return await consola.prompt(
		"Would you like to use semantic commit messages?",
		{
			type: "confirm",
			initial: false,
		},
	);
}

async function setMaxLenPrompt() {
	return await consola.prompt("Enter the max length of the commit message:", {
		type: "text",
		placeholder: "150",
		default: "150",
	});
}

async function stageFiles() {
	return await consola.prompt("Would you like to stage all files?", {
		type: "confirm",
		initial: true,
	});
}

async function commitFiles() {
	return await consola.prompt(
		"Would you like to commit the files with the generated commit message?",
		{
			type: "confirm",
			initial: false,
		},
	);
}

async function regenerate() {
	return await consola.prompt("Would you like to regenerate the message?", {
		type: "confirm",
		initial: false,
	});
}
export const messages = {
	prompt: {
		overwriteApiKeyPrompt,
		setApiKeyPrompt,
		setModelPrompt,
		setSemanticPrompt,
		setMaxLenPrompt,
		stageFiles,
		commitFiles,
		regenerate,
	},
	box: {
		config: (config: unknown) => {
			consola.box({
				title: "Current configuration",
				message: config,
			});
		},
		stageFiles: (files: string[]) => {
			consola.box({
				title: "Files with changes ready to be staged",
				message: files.join("\n"),
			});
		},
	},
	start: {
		gettingDif: () => consola.start("Getting the diff for staged files..."),
		generating: (model: string) =>
			consola.start(`Generating with model: \`${model}\`.`),
	},
	success: {
		generated: (message: string) => consola.success(`\`${message}\``),
	},
	info: {
		api: (api: string) =>
			consola.info(`Your api key has been set to \`${api}\`.`),
		model: (model: string) =>
			consola.info(`Your model has been set to \`${model}\`.`),
		defaultModel: (model: string) =>
			consola.info(`Using default model: \`${model}\`.`),
	},
	fail: {
		invalidModel: (model: string) =>
			consola.fail(`The model \`${model}\` is not supported.`),
		missingApiKey: () => consola.fail("You need to set your api key first."),
		noGitRepository: () => consola.fail("This is not a git repository."),
		invalidMaxLen: (maxLen: unknown) =>
			consola.fail(`Invalid maxLen: ${maxLen}.`),
		noStagedFiles: () => consola.fail("No staged files."),
		noFilesToStage: () => consola.fail("No files to stage."),
		noMessageGenerated: () => consola.fail("No message generated."),
	},
	error: {
		generic: () => consola.error("An error occurred."),
	},
};
