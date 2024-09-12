const defaultUrl = "https://api.perplexity.ai/";

const supportedModels = [
	"llama-3.1-8b-instruct",
	"llama-3.1-70b-instruct",
	"llama-3.1-sonar-small-128k-chat",
	"llama-3.1-sonar-large-128k-chat",
] as const;

export const PerplexityOptions = {
	defaultUrl: defaultUrl,
	models: supportedModels,
};
