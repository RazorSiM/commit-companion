import { readUser, updateUser } from "rc9";

export const configName = ".commit-companion";

export function readConfig() {
	return readUser(configName);
}

export function updateConfig(config: Record<string, unknown>) {
	updateUser(config, configName);
}
