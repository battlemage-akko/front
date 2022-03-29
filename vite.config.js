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
    '/api': {//此处/apis并不需要保持一致.
            // 测试环境
            target: 'http://localhost:8000',  // 接口域名
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/api': ''   //需要rewrite重写的,
            }
        }
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
