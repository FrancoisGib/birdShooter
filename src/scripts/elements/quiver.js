import quiverImgSrc from '../assets/images/fleches.png';
import GameElement from "./gameElement.js";

/** The class that defines a Quiver in the game */
export default class Quiver extends GameElement {
    static SIZE = 27; /* The size of the quiver's image */

    /**
     * Builds a Quiver for the game
     * 
     * @param {int} x The initial x of the Quiver
     * @param {int} y The initial y of the Quiver
     */
    constructor(x, y) {
        super(quiverImgSrc, x, y);
    }
}

