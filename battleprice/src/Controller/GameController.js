import DbController from "./DbController.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";
const getDb = () => DbController.getDb();

const GameController = {
  // ==========================================
  // SALVAR PONTOS — guarda apenas o recorde
  // ==========================================
  async salvarPontuacao(req, res) {
    try {
      // Extrai e valida o token JWT
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Token não fornecido." });
      }

      const token = authHeader.split(" ")[1];
      let payload;
      try {
        payload = jwt.verify(token, JWT_SECRET);
      } catch {
        return res.status(401).json({ erro: "Token inválido ou expirado." });
      }

      const userId = payload.id;
      const { pontos } = req.body;

      if (pontos === undefined || isNaN(pontos)) {
        return res.status(400).json({ erro: "Pontos inválidos." });
      }

      const db = getDb();

      // Verifica se o usuário já tem linha no ranking
      const linha = await db.get(
        "SELECT pontos FROM ranking WHERE user_id = ?",
        [userId],
      );

      if (!linha) {
        // Cria linha se não existir (segurança)
        await db.run("INSERT INTO ranking (user_id, pontos) VALUES (?, ?)", [
          userId,
          pontos,
        ]);
      } else {
        // Atualiza somente se a nova pontuação for maior (recorde pessoal)
        if (pontos > linha.pontos) {
          await db.run("UPDATE ranking SET pontos = ? WHERE user_id = ?", [
            pontos,
            userId,
          ]);
        }
      }

      return res.status(200).json({ mensagem: "Pontuação salva!", pontos });
    } catch (error) {
      console.error("[GameController] salvarPontuacao:", error);
      return res.status(500).json({ erro: "Erro ao salvar pontos." });
    }
  },

  // ==========================================
  // BUSCAR TOP 10 DO RANKING
  // ==========================================
  async buscarRanking(req, res) {
    try {
      const db = getDb();

      const leaderboard = await db.all(`
        SELECT users.nome, ranking.pontos 
        FROM ranking 
        JOIN users ON ranking.user_id = users.id 
        ORDER BY ranking.pontos DESC 
        LIMIT 10
      `);

      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error("[GameController] buscarRanking:", error);
      return res.status(500).json({ erro: "Erro ao buscar ranking." });
    }
  },
};

export default GameController;
