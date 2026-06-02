import { Router } from 'express';
const router = Router();

// Importando os controllers
import authController from './Controller/AuthController.js';
import GameController from './Controller/GameController.js';

// Rotas de Autenticação
router.post('/api/cadastro', authController.register);
router.post('/api/login', authController.login);

// Rotas de Jogo
router.post('/api/salvar-pontos', GameController.salvarPontuacao);
router.get('/api/ranking', GameController.buscarRanking);

export default router;

