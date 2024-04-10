const defaultUrl = "http://localhost:11434/v1/";

const commonModels = [
	"mistral",
	"mixtral",
	"codellama",
	"llama2",
	"codegemma",
	"gemma",
	"nous-hermes2",
	"llava",
	"vicuna",
] as const;

export const OllamaOptions = {
	defaultUrl: defaultUrl,
	models: commonModels,
};
