import express from 'express';
import cors from 'cors';
import routes from './src/routes.js';
import DbController from './src/Controller/DbController.js';

const app = express();

// 1. Configurações e Middlewares 
app.use(cors());
app.use(express.json()); // Lê JSON 
app.use(express.urlencoded({ extended: true })); 

app.use(routes);
const PORT = 3000;

async function start() {
  try {
    await DbController.initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor do Back-end rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

start();