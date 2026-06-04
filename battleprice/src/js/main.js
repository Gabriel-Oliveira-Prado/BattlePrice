import "../css/style.css";
import { fetchProdutoAleatorio, fetchCotacaoDolar } from "./api.js";
import { JogoState } from "./game.js";

const API_BASE = "http://localhost:3000";

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const imagemProduto = document.getElementById("imagem-produto");
const btnChutar = document.getElementById("btn-chutar");
const palpiteInput = document.getElementById("palpite-usuario");
const elementoContador = document.getElementById("contador-chances");
const spinner = document.getElementById("loading-spinner");
const dicaSeta = document.getElementById("dica-seta");

// SweetAlert2 Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#1e293b",
  color: "#fff",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const jogo = new JogoState(3);

// ─── Pega token do localStorage ───────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}

// ─── Envia pontos pro backend ──────────────────────────────────────────────────
async function salvarPontos(pontos) {
  const token = getToken();
  if (!token) return; // usuário não logado, não salva

  try {
    await fetch(`${API_BASE}/api/salvar-pontos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pontos }),
    });
  } catch (err) {
    console.warn("[Pontos] Falha ao salvar pontuação:", err);
  }
}

function atualizarContadorNaTela() {
  elementoContador.innerHTML = jogo.obterMensagemChances();
}

async function carregarProduto() {
  try {
    if (spinner) spinner.style.display = "block";
    imagemProduto.style.display = "none";
    btnChutar.disabled = true;
    palpiteInput.disabled = true;
    if (dicaSeta) dicaSeta.innerHTML = "";

    const cotacao = await fetchCotacaoDolar();
    const item = await fetchProdutoAleatorio();

    const precoReal = parseFloat((item.price * cotacao).toFixed(2));
    jogo.setProduto(precoReal, item.title);

    imagemProduto.onload = () => {
      if (spinner) spinner.style.display = "none";
      imagemProduto.style.display = "block";
      btnChutar.disabled = false;
      palpiteInput.disabled = false;
      palpiteInput.focus();
    };
    imagemProduto.src = item.image;
    imagemProduto.alt = item.title;
  } catch (err) {
    if (spinner) spinner.style.display = "none";
    Toast.fire({
      icon: "error",
      title: "Erro ao carregar produto. Tentando novamente...",
    });
    setTimeout(carregarProduto, 2000);
  }
}

async function processarPalpite() {
  if (btnChutar.disabled) return;

  // Botão "Ver Próximo" — nova rodada
  if (jogo.acabou()) {
    jogo.resetarRodada();
    atualizarContadorNaTela();
    btnChutar.textContent = "Chutar Preço";
    palpiteInput.disabled = false;
    palpiteInput.value = "";
    await carregarProduto();
    return;
  }

  const palpite = parseFloat(palpiteInput.value);
  if (!palpite || palpite <= 0) return;

  const diff = jogo.calcularDiferenca(palpite);
  let mensagem = "";
  let icon = "info";
  let acertou = false;

  if (diff <= 5) {
    // ── ACERTOU ────────────────────────────────────────────────────────────
    acertou = true;
    jogo.registrarAcerto();
    mensagem = `✅ Acertou! +${jogo.pontos} pts — O preço era R$ ${jogo.precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    icon = "success";

    await salvarPontos(jogo.pontos);

    Toast.fire({ icon, title: mensagem });
    jogo.resetarRodada();
    atualizarContadorNaTela();
    palpiteInput.value = "";
    await carregarProduto();
  } else {
    // ── ERROU ─────────────────────────────────────────────────────────────
    jogo.registrarErro();
    atualizarContadorNaTela();

    if (jogo.acabou()) {
      // Sem chances — derrota, zera pontos
      jogo.registrarDerrota();
      await salvarPontos(0);

      if (dicaSeta) dicaSeta.innerHTML = "";
      const precoFormatado = jogo.precoReal.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      });

      elementoContador.innerHTML = `
        <span style="color: #ef4444; display: block; margin-bottom: 5px; font-weight: bold;">Acabaram suas chances! +0 pts</span>
        <span style="color: #22c55e; font-size: 1.2em;">Era <strong>R$ ${precoFormatado}</strong></span>
      `;

      btnChutar.textContent = "Ver Próximo";
      palpiteInput.disabled = true;
      Toast.fire({ icon: "error", title: "Suas chances acabaram! 0 pontos." });
    } else {
      // Ainda tem chances — mostra dica
      if (diff <= 20) {
        mensagem = `Quase! (errou ${diff.toFixed(1)}%) — ${jogo.pontos} pts`;
        icon = "warning";
      } else {
        mensagem = `Longe! — ${jogo.pontos} pts restantes`;
        icon = "error";
      }

      if (dicaSeta) {
        if (palpite < jogo.precoReal) {
          dicaSeta.innerHTML =
            '<i class="bi bi-arrow-up-circle-fill text-success" title="O preço é maior!"></i>';
        } else {
          dicaSeta.innerHTML =
            '<i class="bi bi-arrow-down-circle-fill text-danger" title="O preço é menor!"></i>';
        }
      }

      Toast.fire({ icon, title: mensagem });
      palpiteInput.value = "";
      palpiteInput.focus();
    }
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  if (telaJogo) {
    atualizarContadorNaTela();
    await carregarProduto();
  }
});

btnChutar.addEventListener("click", processarPalpite);

palpiteInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") processarPalpite();
});

palpiteInput.addEventListener("keydown", (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
});

// Confirmação ao sair durante o jogo
const linksSaida = document.querySelectorAll("header a");
linksSaida.forEach((link) => {
  link.addEventListener("click", function (e) {
    if (!telaJogo.classList.contains("escondido")) {
      e.preventDefault();
      Swal.fire({
        title: "Tem certeza que deseja sair?",
        text: "Seu progresso atual será perdido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#3b82f6",
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Cancelar",
        background: "#1e293b",
        color: "#fff",
      }).then((result) => {
        if (result.isConfirmed) window.location.href = this.href;
      });
    }
  });
});
