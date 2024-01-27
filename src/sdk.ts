import consola from "consola";
import { ofetch } from "ofetch";
import { read } from "rc9";
import { generatePrompt } from "./prompt";

const config = read();

const url = "https://api.perplexity.ai/chat/completions";

export const supportedModels = [
	"pplx-7b-chat",
	"pplx-70b-chat",
	"codellama-34b-instruct",
	"llama-2-70b-chat",
	"mistral-7b-instruct",
	"mixtral-8x7b-instruct",
] as const;

export type SupportedModel = (typeof supportedModels)[number];

export async function getCommitMessage(
	diff: string,
	model: SupportedModel,
	maxLength: number,
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
					{ role: "system", content: generatePrompt("english", maxLength) },
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
