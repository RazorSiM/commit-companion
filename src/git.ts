import { execa } from "execa";

export async function isGitRepo() {
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

function excludeGlobFromDiff(glob: string) {
	return `:(exclude)${glob}`;
}

const defaultExcludedGlobs = ["*-lock.*", "*.lock", "node_modules", ".git"].map(
	excludeGlobFromDiff,
);

export async function getStagedDiff(excludedFiles?: string[]) {
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

export function getDetectedMessage(files: string[]) {
	return `Detected ${files.length.toLocaleString()} staged file${
		files.length > 1 ? "s" : ""
	}`;
}
