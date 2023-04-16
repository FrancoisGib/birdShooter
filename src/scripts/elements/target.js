import targetImgSrc from '../assets/images/cible.png';
import GameElement from "./gameElement.js";

/** The class that defines a Target in the game */
export default class Target extends GameElement {
    static SIZE = 64; /* The size of the target's picture */

    /**
     * Builds a Target in the game
     * 
     * @param {int} x The x of the target
     */
    constructor(x) {
        super(targetImgSrc, x, 0);
    }
}
