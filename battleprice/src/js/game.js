export class JogoState {
  constructor(chancesMaximas = 3) {
    this.chancesMaximas = chancesMaximas;
    this.chances = chancesMaximas;
    this.precoReal = 0;
    this.nomeProduto = "";
    this.pontos = 100; // começa com 100 pontos
    this.acertou = false;
  }

  // Desconto por erro: 100 / chancesMaximas (ex: 3 chances → -33 por erro)
  get descontoPorErro() {
    return Math.floor(100 / this.chancesMaximas);
  }

  registrarErro() {
    if (this.chances > 0) {
      this.chances--;
      this.pontos = Math.max(0, this.pontos - this.descontoPorErro);
    }
  }

  // Chama quando acabaram as chances sem acertar — zera os pontos
  registrarDerrota() {
    this.pontos = 0;
    this.acertou = false;
  }

  // Chama quando acertou — pontos ficam como estão
  registrarAcerto() {
    this.acertou = true;
  }

  resetarRodada() {
    this.chances = this.chancesMaximas;
    this.pontos = 100;
    this.acertou = false;
  }

  acabou() {
    return this.chances === 0;
  }

  setProduto(preco, nome) {
    this.precoReal = preco;
    this.nomeProduto = nome;
  }

  calcularDiferenca(palpite) {
    return (Math.abs(palpite - this.precoReal) / this.precoReal) * 100;
  }

  obterMensagemChances() {
    if (this.chances > 0) {
      const cor = this.chances === 1 ? "#ff1900" : "#09ff00";
      const palavra = this.chances === 1 ? "chance" : "chances";
      return `<span style="color: ${cor}">Você tem <strong>${this.chances}</strong> ${palavra} — <strong>${this.pontos}</strong> pts</span>`;
    } else {
      return `<span style="color: #ff1900; display: block; font-weight: bold;">Acabaram suas chances!</span>`;
    }
  }
}
