// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Sempre que o formulário disparar para "/api", o Vite 
      // pega os dados e repassa para o Express na porta 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // tela de login a
        jogo: 'jogo.html',  // Seu jogo
      },
    },
  },
});