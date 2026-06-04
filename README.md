# 🛒 BattlePrice

> Um jogo web onde você testa seus conhecimentos de preço — adivinhe o valor de produtos reais e compete pelo topo do ranking!

---

## 📖 Descrição

O **BattlePrice** é uma aplicação web fullstack no formato de jogo. A cada rodada, um produto aleatório é exibido (com imagem e nome) e o jogador deve adivinhar seu preço em reais. O preço real é buscado de uma API externa e convertido para BRL via cotação do dólar em tempo real.

O jogador tem **3 tentativas** por produto. Após cada erro, o jogo indica se o preço real é maior ou menor do que o palpite dado. Acertando (com margem de até 5%), o jogo parabeniza e avança para o próximo produto. Esgotando as tentativas, o preço correto é revelado. O sistema conta com cadastro de usuários, autenticação e um ranking de pontuações.

---

## 👥 Integrantes

| Nome | Matrícula | Contribuição |
|---|---|---|
| Carlos Henrique Albuquerque Borges | 01797646 | Back-end |
| Gabriel Oliveira do Prado | 01803593 | Front-end |
| Jonathan Gustavo Gomes dos Santos | 01821597 | Back-end |
| Marcelo Henrique José Justino da Silva | 01819017 | Design (UI/UX — Figma) |
| Pedro Henrique Canto Bezerra | 01803171 | Front-end |

**Curso:** Ciências da Computação — 3º Período

---

## 🗂 Sobre o Projeto

Projeto próprio desenvolvido pelo grupo, inspirado no estilo de jogos de adivinhação de preço. Não se enquadra nos projetos sugeridos (Futebol, Cartas ou Hotel) — trata-se de uma criação original.

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **HTML5 / CSS3 / JavaScript (ES6+)** — estrutura, estilo e lógica do jogo
- **Vite 8** — bundler e servidor de desenvolvimento
- **Bootstrap 5.3** — componentes e grid responsivo
- **Bootstrap Icons 1.11** — ícones da interface
- **SweetAlert2** — notificações e toasts animados
- **Google Fonts** — tipografia (Outfit + Inter)

### Backend
- **Node.js** (≥ 20.17) — ambiente de execução
- **Express 5** — servidor HTTP e roteamento da API REST
- **SQLite3 + sqlite** — banco de dados local (usuários e ranking)
- **bcryptjs** — criptografia de senhas
- **jsonwebtoken (JWT)** — autenticação stateless
- **dotenv** — gerenciamento de variáveis de ambiente
- **cors** — controle de origens permitidas
- **axios** — requisições HTTP no servidor
- **concurrently** — execução simultânea de frontend e backend em desenvolvimento

### APIs Externas
- **Fake Store API** (`fakestoreapi.com`) — catálogo de produtos com imagens e preços em USD
- **AwesomeAPI** (`economia.awesomeapi.com.br`) — cotação do dólar (USD → BRL) em tempo real

---

## ⚠️ Pré-requisitos

- **Node.js** versão **20.17.0 ou superior**
- **npm** versão **9+** (já incluso com o Node.js)

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/Gabriel-Oliveira-Prado/BattlePrice.git
cd BattlePrice/battleprice
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie (ou verifique) o arquivo `.env` na raiz da pasta `battleprice/`:

```env
JWT_SECRET=battleprice_secret_key
```

> ⚠️ **Não exponha este arquivo publicamente.** Ele já está listado no `.gitignore`.

### 4. Execute o projeto (frontend + backend juntos)

```bash
npm run dev
```

Esse comando usa o `concurrently` para subir:
- O **frontend** (Vite) em `http://localhost:5173`
- O **backend** (Express) em `http://localhost:3000`

Acesse `http://localhost:5173` no navegador para jogar.

---

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia frontend e backend simultaneamente |
| `npm run dev:front` | Inicia apenas o Vite (frontend) |
| `npm run dev:back` | Inicia apenas o Express (backend) |

---

## ✅ Funcionalidades Implementadas

- **Jogo de adivinhação de preços** com produtos aleatórios de 4 categorias (eletrônicos, joias, roupas masculinas e femininas)
- **Conversão de preço em tempo real** USD → BRL via cotação da AwesomeAPI
- **Sistema de 3 tentativas** por produto com feedback após cada erro
- **Dica de direção** (seta ↑ ou ↓) indicando se o preço real é maior ou menor
- **Feedback de proximidade** — alerta "Quase!" quando o erro é menor que 20%
- **Tela de acerto** com o preço correto formatado em BRL
- **Tela de derrota** revelando o preço ao esgotar as tentativas
- **Carregamento com spinner** durante a busca de produtos
- **Alerta de saída** (SweetAlert2) ao tentar sair durante uma partida ativa
- **Cadastro de usuários** com validação e criptografia de senha (bcryptjs)
- **Login com JWT** — token gerado no backend e enviável ao frontend
- **Banco de dados SQLite** com tabelas `users` e `ranking`
- **API de ranking** — busca o Top 10 jogadores por pontuação
- **API de pontuação** — salva/atualiza a pontuação do jogador autenticado
- **Interface responsiva** para desktop e mobile
- **Animações de entrada** nas telas com CSS (`slideUpFade`)

---

## 🎯 Desafios Extras

- **Cotação de câmbio em tempo real:** o preço dos produtos (originalmente em USD) é convertido dinamicamente para BRL consultando a AwesomeAPI a cada rodada, com fallback automático para R$ 5,70 em caso de falha de rede.
- **Tolerância de acerto configurável:** a margem de acerto de 5% permite variações razoáveis no palpite, tornando o jogo mais justo para produtos de preço alto.
- **Proteção contra múltiplos cliques:** o botão "Chutar" é desabilitado durante o carregamento para evitar estados inconsistentes.
- **Retry automático:** em caso de falha na API de produtos, o sistema tenta recarregar automaticamente após 2 segundos.

---

## 🖥 Exemplos de Saída no Console

Ao iniciar o servidor com `npm run dev`, você verá no terminal:

```
[0] Banco de dados e tabelas (users e ranking) prontos!
[0] Servidor do Back-end rodando em http://localhost:3000
[1]   VITE v8.x.x  ready in Xms
[1]
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

Exemplo de saída ao cadastrar um novo usuário (`POST /api/cadastro`):

```json
{
  "mensagem": "Usuário cadastrado com sucesso!",
  "usuario": {
    "id": "1718123456789",
    "nome": "Pedro Henrique",
    "email": "pedro@email.com"
  }
}
```

Exemplo de saída ao fazer login (`POST /api/login`):

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "1718123456789",
    "nome": "Pedro Henrique",
    "email": "pedro@email.com"
  }
}
```

Exemplo de resposta do ranking (`GET /api/ranking`):

```json
[
  { "nome": "Carlos Henrique", "pontos": 1500 },
  { "nome": "Gabriel Prado",   "pontos": 1200 },
  { "nome": "Jonathan Gustavo","pontos": 900  }
]
```

---

## 📁 Estrutura do Projeto

```
battleprice/
├── public/               # Assets públicos (ícones SVG)
├── Views/                # Páginas HTML (login, cadastro, jogo)
├── src/
│   ├── css/              # Estilos (global, header, login, jogo)
│   ├── js/               # Lógica do frontend (main, game, api)
│   ├── Controller/       # Controllers do backend (Auth, Game, DB)
│   └── routes.js         # Rotas da API Express
├── index.html            # Página inicial (home)
├── server.js             # Entrada do servidor Express
├── package.json
└── .env                  # Variáveis de ambiente (não versionado)
```

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins de avaliação. Todos os direitos reservados aos integrantes do grupo.
