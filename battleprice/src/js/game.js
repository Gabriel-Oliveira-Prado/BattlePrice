export class JogoState {
  constructor(chancesMaximas = 3) {
    this.chancesMaximas = chancesMaximas;
    this.chances = chancesMaximas;
    this.precoReal = 0;
    this.nomeProduto = "";
  }

  registrarErro() {
    if (this.chances > 0) {
      this.chances--;
    }
  }

  resetarChances() {
    this.chances = this.chancesMaximas;
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
      const cor = this.chances === 1 ? '#ff1900' : '#09ff00';
      const palavra = this.chances === 1 ? 'chance' : 'chances';
      return `<span style="color: ${cor}">Você tem <strong>${this.chances}</strong> ${palavra}</span>`;
    } else {
      return `<span style="color: #ff1900; display: block; font-weight: bold;">Acabaram suas chances!</span>`;
    }
  }
}
