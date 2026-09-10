import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: 'resources/js/admin.js',
            formats: ['iife'],
            name: 'ProjectAdmin',
        },
        outDir: 'public/js',
        rollupOptions: {
            external: ['vue'],
            output: {
                entryFileNames: 'admin.js',
                globals: { vue: 'Admin.Vue.runtime' },
            },
        },
        sourcemap: true,
    },
    plugins: [vue()],
})
