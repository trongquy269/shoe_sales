import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			input: 'src/index.jsx',
		},
	},
	esbuild: {
		// Set the loader for .js files to `jsx`
		loader: 'jsx',
		include: /src\/.*\.jsx?$/,
	},
});
