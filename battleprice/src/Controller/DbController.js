import sqlite3 from 'sqlite3'; 
import { open } from 'sqlite'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

const DbController = {
  async initDatabase() {
    try {
      dbInstance = await open({
        filename: path.join(__dirname, '../../battleprice.sqlite'),
        driver: sqlite3.Database 
      });

      // 1. Tabela de Usuários
      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL
        )
      `);

      // 2. Tabela de Ranking (conectada à tabela de usuários)
      // Se o usuário for deletado, os pontos dele somem automaticamente (ON DELETE CASCADE)
      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS ranking (
          user_id TEXT PRIMARY KEY,
          pontos INTEGER DEFAULT 0,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      console.log('Banco de dados e tabelas (users e ranking) prontos!');
    } catch (error) {
      console.error('Erro ao inicializar o banco:', error);
      throw error;
    }
  },

  getDb() {
    if (!dbInstance) {
      throw new Error('Banco de dados não inicializado.');
    }
    return dbInstance;
  }
};

export default DbController;