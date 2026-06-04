import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import DbController from './DbController.js';

const JWT_SECRET = 'sua_chave_secreta_super_segura'; //usar o dotenv para alterar isso

const authController = {
  // ==========================================
  // CADASTRO DE USUÁRIO
  // ==========================================
  async register(req, res) {
    try {
      
      const { nome, email, senha } = req.body;
      const db = DbController.getDb(); // Pega a instância do banco

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
      }

      // 1. Verificar no SQLite se o e-mail já existe
      const userExists = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      
      if (userExists) {
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      // 2. Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);

      // 3. Salvar no banco usando o db.run 
      const userId = Date.now().toString();
      
      await db.run(
        'INSERT INTO users (id, nome, email, senha) VALUES (?, ?, ?, ?)',
        [userId, nome, email, hashedPassword]
      );

      await db.run(
        'INSERT INTO ranking (user_id, pontos) VALUES (?, ?)',
        [userId, 0]
      );

      return res.status(201).json({ 
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: { id: userId, nome, email }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
    }
  },

  // ==========================================
  // LOGIN DE USUÁRIO
  // ==========================================
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const db = DbController.getDb(); 

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      // 1. Buscar o usuário pelo e-mail no SQLite
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      
      if (!user) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // 2. Comparar a senha digitada com a criptografada do banco (user.senha)
      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // 3. Gerar o Token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      return res.status(200).json({
        //Adicionar um redrect para a página do jogo aqui, ou fazer isso no front-end após receber a resposta de sucesso
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: { id: user.id, nome: user.nome, email: user.email }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
    }
  }
};

export default authController;