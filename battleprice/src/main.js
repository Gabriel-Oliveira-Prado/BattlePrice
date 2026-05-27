import "./style.css";
import { setupCounter } from "./counter.js"; 

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const imagemProduto = document.getElementById("imagem-produto");
const btnChutar = document.getElementById("btn-chutar");
const palpiteInput = document.getElementById("palpite-usuario");
const elementoContador = document.getElementById("contador-chances");

let precoReal = 0;
let nomeProduto = "";

// Função para descobrir quantas chances ainda restam olhando o texto do elemento
function obterChancesAtuais() {
  // Se o texto contiver "Você tem 3", extrai o número 3. Se contiver "Acabaram", retorna 0.
  const texto = elementoContador.innerText;
  if (texto.includes("Acabaram")) return 0;
  const match = texto.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

async function carregarProduto() {
  const categorias = ["electronics", "jewelery", "men's clothing", "women's clothing"];
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];

  const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(categoria)}`);
  const produtos = await res.json();
  const item = produtos[Math.floor(Math.random() * produtos.length)];

  const cotacao = 5.7;
  precoReal = parseFloat((item.price * cotacao).toFixed(2));
  nomeProduto = item.title;

  imagemProduto.src = item.image;
  imagemProduto.alt = item.title;

  const nomeEl = document.getElementById("nome-produto");
  if (nomeEl) nomeEl.textContent = item.title;
}

// ── Ao clicar na tela inicial ──
telaInicial.addEventListener("click", async function () {
  telaInicial.classList.add("escondido");
  telaJogo.classList.remove("escondido");
  await carregarProduto();
});

// ── Ao chutar o preço ──
btnChutar.addEventListener("click", function () {
  
  // SE AS CHANCES JÁ ACABARAM: Avança para o próximo produto
  if (obterChancesAtuais() === 0) {
    elementoContador.resetCounter(); // REINICIA para 3 chances de verdade
    carregarProduto();        
    btnChutar.textContent = "Chutar Preço"; 
    palpiteInput.value = "";
    palpiteInput.disabled = false; 
    return;
  }

  const palpite = parseFloat(palpiteInput.value);
  if (!palpite || palpite <= 0) return;

  const diff = (Math.abs(palpite - precoReal) / precoReal) * 100;
  let mensagem = "";
  let acertou = false;

  if (diff <= 5) {
    mensagem = `🎯 Incrível! Acertou! O preço era R$ ${precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    acertou = true;
  } else {
    // Se errou, diminui 1 chance usando o clique
    elementoContador.click(); 
    
    if (diff <= 20) {
      mensagem = `🔥 Quase! (você errou ${diff.toFixed(1)}%)`;
    } else {
      mensagem = `❌ Longe! (você errou ${diff.toFixed(1)}%)`;
    }
  }

  // ── VERIFICAÇÃO APÓS O CHUTE ──
  if (acertou) {
    alert(mensagem);
    elementoContador.resetCounter(); // 🎯 SE ACERTOU: Volta o contador para 3 na hora!
    carregarProduto();               // Carrega o próximo item
    palpiteInput.value = "";
  } else if (obterChancesAtuais() === 0) {
    // Se as chances zeraram com o erro atual:
    const precoFormatado = precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    
    elementoContador.innerHTML = `
      <span style="color: #ff1900; display: block; margin-bottom: 5px; font-weight: bold;">Acabaram suas chances!</span>
      <span style="color: #09ff00; font-size: 1.2em;">O preço correto era <strong>R$ ${precoFormatado}</strong></span>
    `;

    btnChutar.textContent = "Ver Próximo Produto";
    palpiteInput.disabled = true;
    
    alert(`${mensagem}\nSuas chances acabaram! O preço correto foi revelado na tela.`);
  } else {
    // Errou mas ainda tem chances restantes
    alert(mensagem);
    palpiteInput.value = "";
  }
});

if (elementoContador) {
  setupCounter(elementoContador);
}