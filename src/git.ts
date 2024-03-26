import { execa } from "execa";
import { consola } from "./consola";
export async function isGitRepo(): Promise<string> {
	const { stdout, failed } = await execa(
		"git",
		["rev-parse", "--show-toplevel"],
		{ reject: false },
	);

	if (failed) {
		throw new Error("The current directory is not a git repository!");
	}

	return stdout;
}

function excludeGlobFromDiff(glob: string): string {
	return `:(exclude)${glob}`;
}

const defaultExcludedGlobs = ["*-lock.*", "*.lock", "node_modules", ".git"].map(
	excludeGlobFromDiff,
);

export async function getStagedFiles(): Promise<string[]> {
	const { stdout } = await execa("git", ["diff", "--name-only", "--cached"]);
	if (!stdout.trim()) {
		return [];
	}
	return stdout.trim().split("\n");
}

export async function filesReadyToBeStaged(): Promise<{
	value: string[];
	raw: string;
}> {
	const { stdout } = await execa("git", ["diff", "--name-only"]);
	if (!stdout.trim()) {
		return {
			value: [],
			raw: stdout,
		};
	}
	return {
		value: stdout.trim().split("\n"),
		raw: stdout,
	};
}

export async function stageFiles() {
	await execa("git", ["add", "."]);
}

export async function getStagedDiff(excludedFiles?: string[]): Promise<
	| {
			files: string[];
			diff: string;
	  }
	| undefined
> {
	const diffCached = ["diff", "--cached", "--diff-algorithm=minimal"];
	const { stdout: files } = await execa("git", [
		...diffCached,
		"--name-only",
		...defaultExcludedGlobs,
		...(excludedFiles ? excludedFiles.map(excludeGlobFromDiff) : []),
	]);

	if (!files) {
		return;
	}

	const { stdout: diff } = await execa("git", [
		...diffCached,
		...defaultExcludedGlobs,
		...(excludedFiles ? excludedFiles.map(excludeGlobFromDiff) : []),
	]);

	return {
		files: files.split("\n"),
		diff,
	};
}

export function getDetectedMessage(files: string[]): string {
	return `Detected ${files.length.toLocaleString()} staged file${
		files.length > 1 ? "s" : ""
	}`;
}

export async function commitFiles(message: string) {
	await execa("git", ["commit", "-m", message]);
}
