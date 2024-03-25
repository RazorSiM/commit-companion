import consola from "consola";
import { ofetch } from "ofetch";
import { readConfig } from "./config";
import { generatePrompt } from "./prompt";

const config = readConfig();

const url = "https://api.perplexity.ai/chat/completions";

export const supportedModels = [
	"sonar-small-chat",
	"sonar-medium-chat",
	"codellama-70b-instruct",
	"mistral-7b-instruct",
	"mixtral-8x7b-instruct",
] as const;

export type SupportedModel = (typeof supportedModels)[number];

export async function getCommitMessage(
	diff: string,
	model: SupportedModel,
	maxLength: number,
	semantic = false,
) {
	try {
		const response = await ofetch(url, {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization: `Bearer ${config.api}`,
			},
			body: {
				model: model,
				messages: [
					{
						role: "system",
						content: generatePrompt("english", maxLength, semantic),
					},
					{ role: "user", content: diff },
				],
				max_tokens: 200,
				temperature: 0.7,
				top_p: 1,
				stream: false,
				presence_penalty: 0,
			},
		});
		return response;
	} catch (e) {
		consola.fatal(e);
	}
}
