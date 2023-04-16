import redParticlesSrc from '../assets/images/redParticles.png';
import blueParticlesSrc from '../assets/images/blueParticles.png';
import GameElement from "./gameElement.js";

/** The class that defines particles in the game */
export default class Particles extends GameElement {
    #particles;

    /**
     * Builds particles for the game
     * 
     * @param {int} x The initial x of the particles
     * @param {int} y The initial y of the particles
     */
    constructor(x, y, color) {
        super(color ? redParticlesSrc : blueParticlesSrc, x, y, 3, 3);
        this.#particles = Array();
        for (let i = 0; i < 20; i++) {
            this.addParticle();
        }
    }

    get particles() {
        return this.#particles;
    }

    addParticle() {
        const x = Math.floor(Math.random() * 40) + this.x - 20;
        const y = this.y - Math.floor(Math.random() *  + 40);
        const imageX = Math.floor(Math.random() * 4);
        const life = Math.floor(Math.random() * 150) - 50;
        this.#particles.push({x: x, y: y, life: life, image: imageX, direction: this.x < x  ? 1 : -1});
    }

    /**
     * Tell if a particle is out of the canvas dimensions
     * 
     * @param {HTMLElement} canvas The canvas to check dimensions with
     * @returns True if the element is out of the canvas, else false
     */
    filterAndMove(canvas) {
        this.#particles = this.#particles.filter(particle => particle.y < canvas.height && particle.life > 0);
        this.#particles.forEach(particle => {
            particle.y += this.deltaY;
            particle.x += Math.random() < 0.98 ? 0 : this.deltaX * particle.direction;
            particle.life--;
        });
    }

    draw(canvas) {
        this.#particles.forEach(particle => canvas.getContext("2d").drawImage(this.image, particle.image * Math.floor(this.image.width / 4), 0, Math.floor(this.image.width / 4), this.image.height, particle.x, particle.y, Math.floor(this.image.width / 4) / 2, this.image.height / 2));
    }
}

