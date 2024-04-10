const defaultUrl = "https://api.perplexity.ai/";

const supportedModels = [
	"sonar-small-chat",
	"sonar-medium-chat",
	"codellama-70b-instruct",
	"mistral-7b-instruct",
	"mixtral-8x7b-instruct",
] as const;

export const PerplexityOptions = {
	defaultUrl: defaultUrl,
	models: supportedModels,
};
