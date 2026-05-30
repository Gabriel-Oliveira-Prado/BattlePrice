import "../css/style.css";
import { fetchProdutoAleatorio, fetchCotacaoDolar } from "./api.js";
import { JogoState } from "./game.js";

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const imagemProduto = document.getElementById("imagem-produto");
const btnChutar = document.getElementById("btn-chutar");
const palpiteInput = document.getElementById("palpite-usuario");
const elementoContador = document.getElementById("contador-chances");
const spinner = document.getElementById("loading-spinner");
const dicaSeta = document.getElementById("dica-seta");

// SweetAlert2 Toast Config
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e293b', // Match the slate theme
  color: '#fff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const jogo = new JogoState(3);

function atualizarContadorNaTela() {
  elementoContador.innerHTML = jogo.obterMensagemChances();
}

async function carregarProduto() {
  try {
    // Estado de Loading
    if (spinner) spinner.style.display = 'block';
    imagemProduto.style.display = 'none';
    btnChutar.disabled = true;
    palpiteInput.disabled = true;
    if (dicaSeta) dicaSeta.innerHTML = '';

    // Busca dados
    const cotacao = await fetchCotacaoDolar();
    const item = await fetchProdutoAleatorio();

    const precoReal = parseFloat((item.price * cotacao).toFixed(2));
    jogo.setProduto(precoReal, item.title);

    // Atualiza Imagem
    imagemProduto.onload = () => {
      if (spinner) spinner.style.display = 'none';
      imagemProduto.style.display = 'block';
      btnChutar.disabled = false;
      palpiteInput.disabled = false;
      palpiteInput.focus();
    };
    imagemProduto.src = item.image;
    imagemProduto.alt = item.title;

  } catch (err) {
    if (spinner) spinner.style.display = 'none';
    Toast.fire({ icon: 'error', title: 'Erro ao carregar produto. Tentando novamente...' });
    // Tenta carregar novamente em caso de falha após 2 segundos
    setTimeout(carregarProduto, 2000);
  }
}

function processarPalpite() {
  if (btnChutar.disabled) return; // Proteção contra múltiplos cliques no loading

  if (jogo.acabou()) {
    jogo.resetarChances();
    atualizarContadorNaTela();
    btnChutar.textContent = "Chutar Preço";
    palpiteInput.value = "";
    carregarProduto();        
    return;
  }

  const palpite = parseFloat(palpiteInput.value);
  if (!palpite || palpite <= 0) return;

  const diff = jogo.calcularDiferenca(palpite);
  let mensagem = "";
  let icon = 'info';
  let acertou = false;

  if (diff <= 5) {
    mensagem = `Acertou! O preço era R$ ${jogo.precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    icon = 'success';
    acertou = true;
  } else {
    jogo.registrarErro();
    atualizarContadorNaTela();
    
    if (diff <= 20) {
      mensagem = `Quase! (errou ${diff.toFixed(1)}%)`;
      icon = 'warning';
    } else {
      mensagem = "";
      icon = 'error';
    }
  }

  if (acertou) {
    Toast.fire({ icon, title: mensagem });
    jogo.resetarChances();
    atualizarContadorNaTela();
    carregarProduto();
    palpiteInput.value = "";
  } else if (jogo.acabou()) {
    if (dicaSeta) dicaSeta.innerHTML = '';
    const precoFormatado = jogo.precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    
    elementoContador.innerHTML = `
      <span style="color: #ef4444; display: block; margin-bottom: 5px; font-weight: bold;">Acabaram suas chances!</span>
      <span style="color: #22c55e; font-size: 1.2em;">Era <strong>R$ ${precoFormatado}</strong></span>
    `;

    btnChutar.textContent = "Ver Próximo";
    palpiteInput.disabled = true;
    
    Toast.fire({ icon: 'error', title: 'Suas chances acabaram!' });
  } else {
    if (dicaSeta) {
      if (palpite < jogo.precoReal) {
        dicaSeta.innerHTML = '<i class="bi bi-arrow-up-circle-fill text-success" title="O preço é maior!"></i>';
      } else {
        dicaSeta.innerHTML = '<i class="bi bi-arrow-down-circle-fill text-danger" title="O preço é menor!"></i>';
      }
    }
    if (mensagem) {
      Toast.fire({ icon, title: mensagem });
    }
    palpiteInput.value = "";
    palpiteInput.focus();
  }
}

// Inicia o jogo automaticamente quando a página carrega
document.addEventListener("DOMContentLoaded", async () => {
  if (telaJogo) {
    atualizarContadorNaTela();
    await carregarProduto();
  }
});

btnChutar.addEventListener("click", processarPalpite);

// Suporte para tecla Enter no input
palpiteInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    processarPalpite();
  }
});

// Impede a digitação da letra "e" e sinais matemáticos no input number
palpiteInput.addEventListener("keydown", function(event) {
  if (["e", "E", "+", "-"].includes(event.key)) {
    event.preventDefault();
  }
});

// Intercept exit links during gameplay
const linksSaida = document.querySelectorAll('header a');
linksSaida.forEach(link => {
  link.addEventListener('click', function(e) {
    if (!telaJogo.classList.contains("escondido")) {
      e.preventDefault();
      Swal.fire({
        title: 'Tem certeza que deseja sair?',
        text: "Seu progresso atual será perdido!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3b82f6',
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar',
        background: '#1e293b',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = this.href;
        }
      });
    }
  });
});