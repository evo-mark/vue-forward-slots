/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: "src/index.ts",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["vue"],
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
	},
});
