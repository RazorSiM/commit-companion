import { readUser, updateUser } from "rc9";
import type { SupportedModel } from "./sdk";

export const configName = ".commit-companion";

export interface UserConfiguration {
	api?: string;
	model?: SupportedModel;
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
