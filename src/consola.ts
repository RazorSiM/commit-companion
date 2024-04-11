import { createConsola } from "consola";
import { OllamaOptions, PerplexityOptions } from "./sdk";

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

async function setApiKeyPrompt(initialValue = "") {
	return await consola.prompt("Enter your API key:", {
		type: "text",
		placeholder: "API key",
		initial: initialValue,
		default: "",
	});
}

async function setPerplexityModelPrompt() {
	return await consola.prompt("Please choose one of the `following models`:", {
		type: "select",
		options: [...PerplexityOptions.models, "custom"],
	});
}

async function setOllamaModelPrompt() {
	return await consola.prompt("Please choose one of the `following models`:", {
		type: "select",
		options: ["custom", ...OllamaOptions.models],
	});
}

async function setCustomModelPrompt() {
	return await consola.prompt("Enter the custom model:", {
		type: "text",
		placeholder: "Model",
	});
}

async function setBackendPrompt() {
	return await consola.prompt("Please choose one of the following backends:", {
		type: "select",
		options: ["perplexity", "ollama", "custom"],
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

async function setUrlPrompt(initialValue = "") {
	return await consola.prompt("Enter the URL of the API:", {
		type: "text",
		placeholder: "URL",
		initial: initialValue,
	});
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
		setPerplexityModelPrompt,
		setOllamaModelPrompt,
		setCustomModelPrompt,
		setSemanticPrompt,
		setMaxLenPrompt,
		setUrlPrompt,
		setBackendPrompt,
		stageFiles,
		commitFiles,
		regenerate,
	},
	box: {
		config: (config: unknown) => {
			consola.box({
				title: "Config",
				message: config,
				style: {
					padding: 10,
				},
			});
		},
		stageFiles: (files: unknown) => {
			consola.box({
				title: "Files",
				message: files,
				style: {
					padding: 10,
				},
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
		apiKey: (apiKey: string) =>
			consola.info(`Your api key has been set to \`${apiKey}\`.`),
		model: (model: string) =>
			consola.info(`Your model has been set to \`${model}\`.`),
		defaultModel: (model: string) =>
			consola.info(`Using default model: \`${model}\`.`),
		backend: (backend: string) =>
			consola.info(`Using backend: \`${backend}\`.`),
		url: (url: string) => consola.info(`Using url: \`${url}\`.`),
	},
	fail: {
		invalidBackend: (backend: string) =>
			consola.fail(`The backend \`${backend}\` is not supported.`),
		invalidModel: (model: string) =>
			consola.fail(`The model \`${model}\` is not supported.`),
		missingUrl: () => consola.fail("You need to set your url first."),
		missingApiKey: () => consola.fail("You need to set your api key first."),
		missingModel: () => consola.fail("You need to set your model first."),
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
