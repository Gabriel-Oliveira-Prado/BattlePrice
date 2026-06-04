// ranking.js — Painel de Ranking estilo Roblox

const API_BASE = 'http://localhost:3000';

// ─── Cria o HTML do painel (só uma vez) ───────────────────────────────────────
function criarPainel() {
  if (document.getElementById('ranking-panel')) return;

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'ranking-overlay';
  overlay.className = 'ranking-overlay';
  overlay.addEventListener('click', fecharRanking);

  // Painel
  const panel = document.createElement('div');
  panel.id = 'ranking-panel';
  panel.className = 'ranking-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ranking de jogadores');

  panel.innerHTML = `
    <div class="ranking-header">
      <span class="ranking-header-title">
        <i class="bi bi-trophy-fill"></i> Top 10 Jogadores
      </span>
      <button class="ranking-close-btn" id="ranking-close" aria-label="Fechar ranking">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="ranking-list" id="ranking-list">
      <div class="ranking-loading">
        <div class="ranking-spinner"></div>
        Carregando ranking...
      </div>
    </div>

    <div class="ranking-footer">
      <span class="ranking-footer-label">Atualizado agora</span>
      <button class="ranking-refresh-btn" id="ranking-refresh">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  document.getElementById('ranking-close').addEventListener('click', fecharRanking);
  document.getElementById('ranking-refresh').addEventListener('click', () => carregarRanking(true));
}

// ─── Abre o painel ────────────────────────────────────────────────────────────
export function abrirRanking() {
  criarPainel();
  document.getElementById('ranking-overlay').classList.add('aberto');
  document.getElementById('ranking-panel').classList.add('aberto');
  carregarRanking();
}

// ─── Fecha o painel ───────────────────────────────────────────────────────────
export function fecharRanking() {
  const overlay = document.getElementById('ranking-overlay');
  const panel   = document.getElementById('ranking-panel');
  if (overlay) overlay.classList.remove('aberto');
  if (panel)   panel.classList.remove('aberto');
}

// ─── Busca o ranking no backend e renderiza ───────────────────────────────────
export async function carregarRanking(forcar = false) {
  const lista = document.getElementById('ranking-list');
  if (!lista) return;

  lista.innerHTML = `
    <div class="ranking-loading">
      <div class="ranking-spinner"></div>
      Carregando ranking...
    </div>`;

  try {
    const res = await fetch(`${API_BASE}/api/ranking`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const dados = await res.json(); // [{ nome, pontos }, ...]

    if (!dados.length) {
      lista.innerHTML = `
        <div class="ranking-empty">
          <i class="bi bi-emoji-neutral"></i>
          Nenhum jogador no ranking ainda.<br>Seja o primeiro!
        </div>`;
      return;
    }

    lista.innerHTML = dados.map((jogador, i) => {
      const pos   = i + 1;
      const classe = pos <= 3 ? `pos-${pos}` : '';
      const icon   = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
      const inicial = jogador.nome ? jogador.nome.charAt(0).toUpperCase() : '?';
      const pts     = Number(jogador.pontos).toLocaleString('pt-BR');

      return `
        <div class="ranking-item">
          <div class="ranking-pos ${classe}">${pos <= 3 ? icon : pos}</div>
          <div class="ranking-avatar">${inicial}</div>
          <div class="ranking-info">
            <div class="ranking-nome">${escape(jogador.nome)}</div>
            <div class="ranking-pontos"><span>${pts}</span> pontos</div>
          </div>
        </div>`;
    }).join('');

    // Atualiza label do rodapé
    const footer = document.querySelector('.ranking-footer-label');
    if (footer) {
      const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      footer.textContent = `Atualizado às ${agora}`;
    }

  } catch (err) {
    console.error('[Ranking] Erro ao buscar:', err);
    lista.innerHTML = `
      <div class="ranking-empty">
        <i class="bi bi-wifi-off"></i>
        Não foi possível carregar.<br>
        <small style="color:#475569">Verifique se o servidor está rodando.</small>
      </div>`;
  }
}

// Escapa HTML para evitar XSS
function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Fecha com ESC ────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharRanking();
});
