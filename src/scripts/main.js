// importation de la classe Game.js
import Game from './game.js';

// mise en place de l'action des clics sur les boutons + les gestionnaires du clavier pour contrôler le panier
const init = () => {
   const canvas = document.getElementById("playfield");
   const game = new Game(canvas);
   document.getElementById("stopAndStartGame").addEventListener("click", event => {
      event.target.blur();
      game.startAndStop();
   });
   document.getElementById("ak-47").addEventListener("click", event => {
      event.target.blur();
      game.AK47BANG();
   });
}

window.addEventListener("load", init);
