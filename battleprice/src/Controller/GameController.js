import sqlite3 from './DbController.js'; // Importa o controlador de banco de dados para acessar a função getDb()

const GameController = {
  // ==========================================
  // SALVAR / ATUALIZAR PONTOS
  // ==========================================
  async salvarPontuacao(req, res) {
    try {
      const { pontos } = req.body;
      const userId = req.userId; // Esse ID virá do seu Middleware de autenticação JWT

      const db = getDb();

      // Atualiza os pontos se a nova pontuação for maior que a antiga (exemplo de Recorde)
      await db.run(
        'UPDATE ranking SET pontos = ? WHERE user_id = ? AND ? > pontos',
        [pontos, userId, pontos]
      );

      return res.status(200).json({ mensagem: 'Pontuação atualizada!' });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao salvar pontos.' });
    }
  },

  // ==========================================
  // BUSCAR RANKING DO MAIOR PARA O MENOR
  // ==========================================
  async buscarRanking(req, res) {
    try {
      const db = getDb();

      // O comando JOIN junta o Nome do usuário com a Pontuação dele, e ordena do maior para o menor
      const leaderboard = await db.all(`
        SELECT users.nome, ranking.pontos 
        FROM ranking 
        JOIN users ON ranking.user_id = users.id 
        ORDER BY ranking.pontos DESC 
        LIMIT 10
      `); // LIMIT 10 traz apenas o Top 10 jogadores

      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao buscar ranking.' });
    }
  }
};

export default GameController;