import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/cli.ts"],
	outDir: "dist",
	format: ["cjs"],
	splitting: false,
	sourcemap: true,
	clean: true,
});
