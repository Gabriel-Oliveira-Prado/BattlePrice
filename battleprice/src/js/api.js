export async function fetchCotacaoDolar() {
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL");
    const data = await res.json();
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar, usando valor padrão:", error);
    return 5.7; // Fallback
  }
}

export async function fetchProdutoAleatorio() {
  const categorias = ["electronics", "jewelery", "men's clothing", "women's clothing"];
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];

  const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(categoria)}`);
  if (!res.ok) {
    throw new Error("Erro na resposta da API");
  }
  const produtos = await res.json();
  const item = produtos[Math.floor(Math.random() * produtos.length)];
  return item;
}
