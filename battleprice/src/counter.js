export function setupCounter(element) {
  let counter = 3

  // Agora a função aceita o preço correto como um segundo parâmetro opcional
  const setCounter = (count, precoCorreto = 0) => {
    counter = count
    if (counter > 0) {
      element.innerHTML = `Você tem <strong>${counter}</strong> ${counter === 1 ? 'chance' : 'chances'}`
      element.style.color = counter === 1 ? '#e67e22' : '#25da70' // Laranja para 1 chance, verde para mais
    } else {
      // Quando zera, exibe o preço que era o correto de forma destacada
      element.innerHTML = `
        <span style="color: #e74c3c; display: block; margin-bottom: 5px;">Acabaram suas chances!</span>
        <span style="color: #2ecc71; font-size: 1.1em;">O preço real era <strong>R$ ${precoCorreto}</strong></span>
      `
    }
  }

  element.addEventListener('click', (event) => {
    if (counter > 0) {
      setCounter(counter - 1)
    } else {
      // Se já estava em 0, reseta para 3
      setCounter(3)
    }
  })

  setCounter(3)
}