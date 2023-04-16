import bowImgSrc from '../assets/images/arc.png';
import GameElement from "./gameElement.js";

/** The class that defines a Bow in the game */
export default class Bow extends GameElement {
    static WIDTH = 96; /* The widh of the bow's image */
    static HEIGHT = 71; /* The height of the bow's image */

    /**
     * Builds a bow in the game
     * 
     * @param {int} x The initial x in the game
     * @param {int} y The initial y in the game
     */
    constructor(x, y) {
        super(bowImgSrc, x, y, 10, 10);
    }

    // i et j sont des coefficients qui valent 0, 1 ou -1 pour savoir si l'arc va à gauche ou à droite, en haut ou en bas.
    /**
     * Moves the bow with i and j as coefficients for deltaX ((i,j) -> {-1, 0, 1}) 
     * 
     * @param {HTMLElement} canvas The canvas to make sure the bow isn't out of the canvas
     * @param {int} i The x coefficient to move the bow
     * @param {int} j The y coefficient to move the bow
     */
    move(canvas, i, j) {
        const newX = this.x + this.deltaX*i;
        const newY = this.y + this.deltaY*j;
        if (newX + Bow.WIDTH <= canvas.width && newX >= 0) {
            this.x = newX;
        }
        if (newY + Bow.HEIGHT <= canvas.height && newY >= 100) {
            this.y = newY;
        }
    }
}
