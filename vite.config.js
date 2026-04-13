import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                riadenieProjektov: resolve(__dirname, 'riadenie-projektov/index.html'),
                internetoveRiesenia: resolve(__dirname, 'internetove-riesenia/index.html'),
                grafika: resolve(__dirname, 'grafika/index.html'),
                marketing: resolve(__dirname, 'marketing/index.html'),
                aplikacie: resolve(__dirname, 'aplikacie/index.html'),
                precoMy: resolve(__dirname, 'preco-my/index.html'),
                kontakt: resolve(__dirname, 'kontakt/index.html'),
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
