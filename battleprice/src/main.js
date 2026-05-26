alert("O JavaScript foi carregado com sucesso!");

import './style.css'

// Mudamos o alvo do clique do 'main' para a própria 'tela-inicial'
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');

// Agora o ouvinte fica vigiando a tela inicial
telaInicial.addEventListener('click', function() {
    // 1. Esconde a tela inicial
    telaInicial.classList.add('escondido');
    
    // 2. Mostra a tela do jogo
    telaJogo.classList.remove('escondido');
});