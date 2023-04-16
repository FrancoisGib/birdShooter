/** A class that defines a game element in the game */
export default class GameElement {
    image; /* The image of the element */
    #x; /* The x coord of the element */
    #y; /* The y coord of the element */
    #deltaX; /* The deltaX step of the element */
    #deltaY; /* The deltaY step of the element */

    /**
     * Builds a game element for the game
     * 
     * @param {String} imgsrc The image of the element
     * @param {int} x The initial x coordinate of the element
     * @param {int} y The initial y coordinate of the element
     * @param {int} deltaX The x delta which give the step of a movement
     * @param {int} deltaY The y delta which give the step of a movement
     */
    constructor(imgsrc, x, y, deltaX=0, deltaY=0) {
        this.image = this.#createImage(imgsrc);
        this.#x = x;
        this.#y = y;
        this.#deltaX = deltaX;
        this.#deltaY = deltaY;
    }

    /**
     * Draw an element in the canvas
     * 
     * @param {HTMLElement} canvas The canvas where to draw the game element
     */
    draw(canvas) {
        canvas.getContext("2d").drawImage(this.image, this.x, this.y);
    }

    /**
     * Create an image element with the source in parameter
     * 
     * @param {String} imageSource The source of the image
     * @returns The new Image element
     */
    #createImage(imageSource) {
        const newImg = new Image();
        newImg.src = imageSource;
        return newImg;
    }

    /**
     * Check if this is in collision with the object in parameter
     * 
     * @param {*} object The object to check collisions
     * @returns True if the objects have collisions, else false
     */
    checkCollisions(object) {
        const p1 = [Math.max(this.x, object.x), Math.max(this.y, object.y)];
        const p2 = [Math.min(this.x + this.image.width, object.x + object.image.width), Math.min(this.y + this.image.height, object.y + object.image.height)];
        return (p1[0] < p2[0] && p1[1] < p2[1]);
    }

    /**
     * Set the x value to the value in parameter
     * 
     * @param {int} value The new value of x
     */
    set x(value) {
        this.#x = value;
    }

    /**
     * Set the y value to the value in parameter
     * 
     * @param {int} value The new value of y
     */
    set y(value) {
        this.#y = value;
    }

    /**
     * Give the x value of the element
     * 
     * @returns The value of x
     */
    get x() {
        return this.#x;
    }

    /**
     * Give the y value of the element
     * 
     * @returns The value of y
     */
    get y() {
        return this.#y;
    }

    /**
     * Set the deltaX value to the value in parameter
     * 
     * @param {int} value The new value of deltaX
     */
    set deltaX(value) {
        this.#deltaX = value;
    }

    /**
     * Set the deltaY value to the value in parameter
     * 
     * @param {int} value The new value of deltaY
     */
    set deltaY(value) {
        this.#deltaY = value;
    }

    /**
     * Give the deltaX value of the element
     * 
     * @returns The value of deltaX
     */
    get deltaX() {
        return this.#deltaX;
    }

    /**
     * Give the deltaY value of the element
     * 
     * @returns The value of deltaY
     */
    get deltaY() {
        return this.#deltaY;
    }

    /**
     * Move the element by adding the following deltaX and deltaY to x and y
     */
    move() {
        this.#x = this.#x + this.#deltaX;
        this.#y = this.#y + this.#deltaY;
    }
}