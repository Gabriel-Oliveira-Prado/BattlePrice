export function setupCounter(element) {
  let counter = 3

  const setCounter = (count, precoCorreto = 0) => {
    counter = count
    if (counter > 0) {
      element.innerHTML = `Você tem <strong>${counter}</strong> ${counter === 1 ? 'chance' : 'chances'}`
      element.style.color = counter === 1 ? '#ff1900' : '#09ff00'; // Vermelho para 1 chance, verde para mais
    } else {
      element.innerHTML = `
        <span style="color: #ff1900; display: block; margin-bottom: 5px; font-weight: bold;">Acabaram suas chances!</span>
      `
    }
  }

  // Evento de clique para quando o jogador ERRA (diminui 1)
  element.addEventListener('click', () => {
    if (counter > 0) {
      setCounter(counter - 1)
    }
  })

  // ── NOVA FUNÇÃO CONFIÁVEL PARA RESETAR ──
  // Guardamos essa função direto no elemento para o main.js conseguir usar
  element.resetCounter = () => {
    setCounter(3)
  }

  // Inicializa o jogo com 3
  setCounter(3)
}