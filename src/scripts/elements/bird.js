import droiteImgSrc from '../assets/images/oiseau-voleur-droite-gauche.png';
import gaucheImgSrc from '../assets/images/oiseau-voleur-gauche-droite.png';
import GameElement from "./gameElement.js";

/** The class that defines Bird in the game */
export default class Bird extends GameElement {
    static SIZE = 96; /* The size of the bird's image */

    /**
     * Builds a Bird in the game
     * 
     * @param {int} x The initial x of the element
     * @param {int} direction The direction where the bird must go (1 : left to right, -1 : right to left)
     */
    constructor(x, direction) {
        const src = direction == 1 ? gaucheImgSrc : droiteImgSrc;
        super(src, x, Math.floor(Math.random()*300)+100, direction*4, 0);
    }

    /**
     * Move the x of a bird
     */
    move() {
        this.x += this.deltaX;
    }

    /**
     * Tell if the bird is out of the canvas dimensions
     * 
     * @param {HTMLElement} canvas The canvas to check dimensions with
     * @returns True if the element is out of the canvas, else false
     */
    isOutOfDimension(canvas) {
        return this.x + this.image.width < 0 || this.x - this.image.width > canvas.width;
    }
}


