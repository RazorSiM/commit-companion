#!/bin/env node

import { defineCommand, runMain } from "citty";

export const main = defineCommand({
	meta: {
		name: "commit message companion",
		description: "I will help you write beautiful commit messages through AI!",
		version: "0.0.1",
	},
	subCommands: {
		setup: () => import("./commands/setup").then((r) => r.setupCommand),
		generate: () =>
			import("./commands/generateCommitMessage").then((r) => r.generateCommand),
	},
});

runMain(main);
