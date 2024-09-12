#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { defineCommand, runMain } from "citty";

const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
const version = packageJson.version;

export const main = defineCommand({
	meta: {
		name: "commit message companion",
		description: "I will help you write beautiful commit messages through AI!",
		version,
	},
	subCommands: {
		setup: () => import("./commands/setup").then((r) => r.setupCommand),
		generate: () =>
			import("./commands/generateCommitMessage").then((r) => r.generateCommand),
	},
});

runMain(main);
