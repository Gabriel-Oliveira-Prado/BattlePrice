// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // tela de login a
        jogo: 'jogo.html',  // Seu jogo
      },
    },
  },
});