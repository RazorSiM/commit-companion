import OpenAI, { type ClientOptions } from "openai";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import { consola, messages } from "../consola";
import { generatePrompt } from "../prompt";

const defaultUrl = "https://api.openai.com/v1/";

const supportedModels = [
	"chatgpt-4o-latest",
	"gpt-4o",
	"gpt-4o-mini",
	"gpt-4-turbo",
	"gpt-4",
	"gpt-3.5-turbo",
] as const;

export const OpenAIOptions = {
	defaultUrl: defaultUrl,
	models: supportedModels,
};

export function getHeaders(authorization?: string) {
	const headers: HeadersInit = {
		accept: "application/json",
		"content-type": "application/json",
	};
	if (authorization) {
		headers.authorization = `Bearer ${authorization}`;
	}
	return headers;
}

export function initOpenAIClient(options: ClientOptions) {
	return new OpenAI(options);
}

export interface OpenAIFetcherOptions {
	baseURL: string;
	diff: string;
	maxLength: number;
	model: string;
	apiKey?: string;
	semantic?: boolean;
	language?: string;
	maxTokens?: number;
}

export async function getOpenAIStream(
	params: OpenAIFetcherOptions,
): Promise<ChatCompletionStream> {
	try {
		const client = initOpenAIClient({
			baseURL: params.baseURL,
			apiKey: params.apiKey ?? "",
		});

		return await client.beta.chat.completions.stream({
			model: params.model,
			messages: [
				{
					role: "system",
					content: generatePrompt(
						params.language ?? "english",
						params.maxLength,
						params.semantic ?? false,
					),
				},
				{ role: "user", content: params.diff },
			],
			stream: true,
			max_tokens: params.maxTokens ?? null,
			temperature: 0.1,
			top_p: 1,
			presence_penalty: 0,
		});
	} catch (e) {
		messages.error.generic();
		consola.fatal(e);
		throw e;
	}
}

export async function printOpenAIStream(
	stream: ChatCompletionStream,
): Promise<string | null> {
	stream.on("content", (delta) => {
		process.stdout.write(delta);
	});
	return await stream.finalContent();
}

export async function printStream(
	stream: ReadableStream<Uint8Array>,
	debug: boolean,
): Promise<string> {
	try {
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
