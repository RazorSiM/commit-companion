import { ofetch } from "ofetch";
import { readConfig } from "./config";
import { consola, messages } from "./consola";
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
			responseType: "stream",
			body: {
				model: model,
				messages: [
					{
						role: "system",
						content: generatePrompt("english", maxLength, semantic),
					},
					{ role: "user", content: diff },
				],
				max_tokens: 2000,
				temperature: 0.7,
				top_p: 1,
				stream: true,
				presence_penalty: 0,
			},
		});
		return response;
	} catch (e) {
		messages.error.generic();
		consola.fatal(e);
	}
}
