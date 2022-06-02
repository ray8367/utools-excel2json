import { defineConfig } from 'vite'
import { resolve } from 'path'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import WindiCSS from 'vite-plugin-windicss'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: './',
  define: {
    // 去除vue的options api
    // 不能去除，不能保证组件库完全为Composition API，去掉可能导致组件库功能丢失
    // __VUE_OPTIONS_API__: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variable.scss";`
      },
      less: {
        modifyVars: {
          'arcoblue-6': '#165dff'
        },
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      imports: ['vue', '@vueuse/core']
    }),
    Components({
      resolvers: [ArcoResolver()]
    }),
    chunkSplitPlugin({
      strategy: 'default',
      customSplitting: {
        utils: [/src\/utils/],
        assets: [/src\/assets/],
        'component-library': ['@arco-design/web-vue']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    proxy: {
      // 百度翻译
      '/baiduApi': {
        target: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/baiduApi/, '')
      },
      // 腾讯翻译
      '/tencentApi': {
        target: 'https://tmt.tencentcloudapi.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tencentApi/, '')
      },
      // 有道翻译
      '/youdaoApi': {
        target: 'http://openapi.youdao.com/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/youdaoApi/, '')
      },
      // 彩云小译
      '/caiyunApi': {
        target: 'http://api.interpreter.caiyunai.com/v1/translator',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/caiyunApi/, '')
      },
      // 阿里翻译
      '/aliApi': {
        target: 'http://mt.cn-hangzhou.aliyuncs.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/aliApi/, '')
      }
    }
  }
})
