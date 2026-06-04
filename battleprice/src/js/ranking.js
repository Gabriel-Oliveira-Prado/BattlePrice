// ranking.js — Painel de Ranking com Bootstrap Modal

const API_BASE = 'http://localhost:3000';

let rankingModal = null;

// ─── Cria o HTML do painel (só uma vez) ───────────────────────────────────────
function criarPainel() {
  if (document.getElementById('rankingModal')) return;

  const modalHtml = `
    <div class="modal fade" id="rankingModal" tabindex="-1" aria-labelledby="rankingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow" style="background-color: #233B63; color: #F2F5F5;">
          <div class="modal-header border-bottom-0" style="background-color: #4A77B5;">
            <h5 class="modal-title fw-bold d-flex align-items-center gap-2" id="rankingModalLabel" style="color: #FFC933;">
              <i class="bi bi-trophy-fill" style="color: #FFC933; text-shadow: 1px 1px 2px #D89A14;"></i> Top 10 Jogadores
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0" id="ranking-list" style="background-color: #233B63;">
            <div class="text-center p-5">
              <div class="spinner-border text-warning" role="status"></div>
              <div class="mt-2 text-white">Carregando ranking...</div>
            </div>
          </div>
          <div class="modal-footer border-top-0 d-flex justify-content-between align-items-center" style="background-color: #233B63;">
            <small class="ranking-footer-label" style="color: #F2F5F5; opacity: 0.8;">Atualizado agora</small>
            <button type="button" class="btn fw-bold" id="ranking-refresh" style="background-color: #FF5A3A; color: #F2F5F5; border-bottom: 3px solid #D93C2A;">
              <i class="bi bi-arrow-clockwise"></i> Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  rankingModal = new bootstrap.Modal(document.getElementById('rankingModal'));

  document.getElementById('ranking-refresh').addEventListener('click', () => carregarRanking(true));
  
  // Custom styles for list items
  const style = document.createElement('style');
  style.innerHTML = `
    .ranking-item-bs {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(74, 119, 181, 0.3);
      transition: background 0.2s;
    }
    .ranking-item-bs:hover {
      background-color: rgba(74, 119, 181, 0.2);
    }
    .ranking-pos-bs {
      width: 40px;
      font-size: 1.2rem;
      font-weight: 900;
      text-align: center;
      color: #4A77B5;
    }
    .ranking-pos-bs.pos-1 { color: #FFC933; font-size: 1.5rem; }
    .ranking-pos-bs.pos-2 { color: #C0C0C0; font-size: 1.4rem; }
    .ranking-pos-bs.pos-3 { color: #CD7F32; font-size: 1.3rem; }
    .ranking-avatar-bs {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: #4A77B5;
      color: #F2F5F5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      margin: 0 16px;
      border: 2px solid #233B63;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .ranking-info-bs {
      flex: 1;
    }
    .ranking-nome-bs {
      font-weight: 700;
      color: #F2F5F5;
      font-size: 1.1rem;
    }
    .ranking-pontos-bs {
      font-size: 0.9rem;
      color: #FFC933;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

// ─── Abre o painel ────────────────────────────────────────────────────────────
export function abrirRanking() {
  criarPainel();
  rankingModal.show();
  carregarRanking();
}

// ─── Fecha o painel ───────────────────────────────────────────────────────────
export function fecharRanking() {
  if (rankingModal) rankingModal.hide();
}

// ─── Busca o ranking no backend e renderiza ───────────────────────────────────
export async function carregarRanking(forcar = false) {
  const lista = document.getElementById('ranking-list');
  if (!lista) return;

  lista.innerHTML = `
    <div class="text-center p-5">
      <div class="spinner-border text-warning" role="status"></div>
      <div class="mt-2 text-white">Carregando ranking...</div>
    </div>`;

  try {
    const res = await fetch(`${API_BASE}/api/ranking`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const dados = await res.json();

    if (!dados.length) {
      lista.innerHTML = `
        <div class="text-center p-5" style="color: #F2F5F5; opacity: 0.8;">
          <i class="bi bi-emoji-neutral fs-1 d-block mb-3"></i>
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
        <div class="ranking-item-bs">
          <div class="ranking-pos-bs ${classe}">${pos <= 3 ? icon : pos}</div>
          <div class="ranking-avatar-bs">${inicial}</div>
          <div class="ranking-info-bs">
            <div class="ranking-nome-bs">${escape(jogador.nome)}</div>
            <div class="ranking-pontos-bs">${pts} pt</div>
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
      <div class="text-center p-5" style="color: #FF5A3A;">
        <i class="bi bi-wifi-off fs-1 d-block mb-3"></i>
        Não foi possível carregar.<br>
        <small style="color: #F2F5F5; opacity: 0.7;">Verifique se o servidor está rodando.</small>
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

