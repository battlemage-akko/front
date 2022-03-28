import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  optimizeDeps: {
    include: ['axios'],
  },
  proxy: {
    "/api": {
      target: "http://127.0.0.1:8000/", //代理接口
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "api"),
    },
  },
  css: {
		preprocessorOptions: {
			scss: {
				/*
        scss全局预定义变量，
				 */
				additionalData: '@import "./src/assets/scss/index.scss";'
			}
		}
	}
})
