import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.js'


document.querySelector('#app').innerHTML = `
  <div class="tela-inicial">
    <h1>BattlePrice</h1>
    <p class="piscar">Clique em qualquer lugar para começar</p>
  </div>
`

setupCounter(document.querySelector('#counter'))
