import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(() => {
    return {
        base: './',
        build: {
            minify: true,
            outDir: 'dist',
        },
        server: {
            port: '3002',
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp'
            }
        },
        plugins: [
            uni()
        ],
        exclude:[
            /\/README\.md$/,
        ]
    }
})