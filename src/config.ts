import { readUser, updateUser } from "rc9";

export const configName = ".commit-companion";

export type BackendPrompt = "ollama" | "perplexity" | "custom";
export interface UserConfiguration {
	apiKey?: string;
	model?: string;
	backend?: BackendPrompt;
	url?: string;
}

export function readConfig(): UserConfiguration {
	try {
		return readUser<UserConfiguration>(configName);
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to read the config file: ${e.message}`);
		}
		throw new Error("Failed to read the config file.");
	}
}

export function updateConfig(config: UserConfiguration): UserConfiguration {
	try {
		return updateUser<UserConfiguration>(config, configName);
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`Failed to update the config file: ${e.message}`);
		}
		throw new Error("Failed to update the config file.");
	}
}
