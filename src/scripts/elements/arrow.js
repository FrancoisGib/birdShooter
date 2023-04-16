import arrowImgSrc from '../assets/images/fleche.png';
import GameElement from "./gameElement.js";

/** The class that defines an arrow for the game */
export default class Arrow extends GameElement {

    /**
     * Builds an arrow for the game
     * 
     * @param {*} bow The bow of the game
     */
    constructor(bow) {
        super(arrowImgSrc, bow.x + bow.image.width/2, bow.y, 0, -8);
    }

    /**
     * Tells if the arrow is out of dimensions
     * 
     * @returns True if the arrow is out, else false
     */
    isOutOfDimension() {
        return this.y < 0;
    }

    /**
     * Checks the collisions between the arrow and an object
     * 
     * @param {GameElement} object 
     * @returns True if there's collisions, else false
     */
    checkCollisions(object) {
        const p1 = [Math.max(this.x, object.x), Math.max(this.y, object.y)];
        const p2 = [Math.min(this.x + this.image.width, object.x + object.image.width), Math.min(this.y + this.image.height, object.y + object.image.height)];
        return (p1[0] < p2[0] && p1[1] < p2[1]);
    }
}

