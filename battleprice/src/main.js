import "./style.css";

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const imagemProduto = document.getElementById("imagem-produto");
const btnChutar = document.getElementById("btn-chutar");
const palpiteInput = document.getElementById("palpite-usuario");

let precoReal = 0;
let nomeProduto = "";

// ── Busca produto na FakeStore API ──
async function carregarProduto() {
  const categorias = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];

  const res = await fetch(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(categoria)}`,
  );
  const produtos = await res.json();

  const item = produtos[Math.floor(Math.random() * produtos.length)];

  // Converte dólar → real
  const cotacao = 5.7;
  precoReal = parseFloat((item.price * cotacao).toFixed(2));
  nomeProduto = item.title;

  // Atualiza a imagem
  imagemProduto.src = item.image;
  imagemProduto.alt = item.title;

  // Mostra o nome do produto (se tiver um elemento pra isso)
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
  const palpite = parseFloat(palpiteInput.value);
  if (!palpite || palpite <= 0) return;

  const diff = (Math.abs(palpite - precoReal) / precoReal) * 100;

  let mensagem = "";
  if (diff <= 5) {
    mensagem = `🎯 Incrível! Acertou! O preço era R$ ${precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  } else if (diff <= 20) {
    mensagem = `🔥 Quase! O preço era R$ ${precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (você errou ${diff.toFixed(1)}%)`;
  } else {
    mensagem = `❌ Longe! O preço era R$ ${precoReal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (você errou ${diff.toFixed(1)}%)`;
  }

  alert(mensagem);

  // Carrega próximo produto
  palpiteInput.value = "";
  carregarProduto();
});
