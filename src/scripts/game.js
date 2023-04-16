import Bow from './elements/bow.js';
import Target from './elements/target.js';
import Arrow from './elements/arrow.js';
import Bird from './elements/bird.js';
import Quiver from './elements/quiver.js';
import GameElement from './elements/gameElement.js';
import Ak from './elements/ak-47.js';
import Bullet from './elements/bullet.js';
import Loader from './elements/loader.js';
import Particles from './elements/particles.js';

/** The class that defines the game */
export default class Game {
    canvas; /* The canvas to play the game in */
    weapon; /* The weapon of the game */
    target; /* The target of the game */
    birds; /* The array of current living birds in the game */
    raf; /* The current frame of the game */
    threw; /* The array of arrows thrown and not out of the canvas dimensions */
    quiver; /* The quiver of the game */
    birdTimer; /* The timer that manage the birds spawn in the game */
    quiverTimer; /* The timer that manage the quiver spawn in the game */
    actions; /* The dictionnary that manage the user keys pressing */
    bulletInterval;
    canShoot;
    particles;
    sounds;

    /**
     * Builds a game
     * 
     * @param {*} canvas The canvas to play the game in
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.raf = null;
        this.weapon = null;
        this.addBow();
        this.target = null;
        this.addTarget();
        this.birds = Array();
        this.ammo = 5;
        document.getElementById("nbArrows").textContent = this.ammo;
        this.loader = null;
        this.birdTimer = null;
        this.loaderTimer = null;
        this.threw = Array();
        this.moveActions = [{key: "ArrowLeft", value: false},{key: "ArrowRight", value: false},{key: "ArrowUp", value: false},{key: "ArrowDown", value: false}];
        this.akActions = [{key: "Space", value: false}, {key: "KeyR", value: false}];
        window.addEventListener('keydown', event => this.keyDownActionHandler(event));
        window.addEventListener('keyup', event => this.keyUpActionHandler(event));
        this.bulletInterval = null;
        this.canShoot = true;
        this.loadersInStock = 0;
        this.particles = Array();
        this.backGroundSelector();
        this.sounds = true;
        const soundButton = document.getElementById("sound");
        soundButton.addEventListener("click", () => {
            if (this.sounds) {
                this.sounds = false;
                soundButton.textContent = "Off";
            }
            else {
                this.sounds = true;
                soundButton.textContent = "On";
            }
        })
    }

    /**
     * Adds a bow to the game
     */
    addBow() {
        this.weapon = new Bow(this.canvas.width/2 - Bow.WIDTH/2, this.canvas.height - Bow.HEIGHT, 10, 10);
        clearInterval(this.bulletInterval);
    }
    
    addAk() {
        this.weapon = new Ak(this.canvas.width/2 - Ak.WIDTH/2, this.canvas.height - Ak.HEIGHT, 10, 10);
    }

    AK47BANG() {
        if (this.weapon instanceof Bow) {
            this.bulletInterval = setInterval(() => this.canShoot = true, 100);
            this.addAk();
            document.getElementById("ak-47").textContent = "Bow";
            document.getElementById("nbLoaders").textContent = this.loadersInStock;
            document.getElementById("loaders").style.display = "block";
            document.getElementById("lifes").childNodes.forEach(life => life.src = "./images/akQ.png");
            document.getElementById("reload").textContent = "Appuyez sur R pour recharger l'Ak-47 (Si vous avez un chargeur en stock)";
            document.querySelector("#arrows img").src = "./images/bulletQ.png";
            this.ammo = 30;
        }
        else {
            this.addBow();
            document.getElementById("ak-47").textContent = "AK-47";
            document.getElementById("nbLoaders").textContent = "";
            clearInterval(this.bulletInterval);
            document.getElementById("loaders").style.display = "None";
            document.getElementById("lifes").childNodes.forEach(life => life.src = "./images/arc.png");
            document.querySelector("#arrows img").src = "./images/fleches.png";
            document.getElementById("reload").textContent = "";
            this.ammo = 5;
        }
        if (this.loader != null) {
            this.addLoader();
        }
        document.getElementById("nbArrows").textContent = this.ammo;
    }
    
    reload() {
        if (this.loadersInStock > 0 && this.weapon instanceof Ak && this.ammo < 30) {
            this.ammo = 30;
            document.getElementById("nbArrows").textContent = this.ammo;
            this.loadersInStock--;
            document.getElementById("nbLoaders").textContent = this.loadersInStock;
            this.launchSound("./sounds/reload.mp3");
        }
    }

    /**
     * Adds a loader to the game, if there's already one, it's replaced
     */
    addLoader() {
        let newX = Math.random()*this.canvas.width;
        if (newX + Quiver.SIZE > this.canvas.width) {
            newX -= Quiver.SIZE;
        }
        if (this.weapon instanceof Bow) {
            this.loader = new Quiver(newX, Math.floor(Math.random()*300)+100);   
        }
        else {
            this.loader = new Loader(newX, Math.floor(Math.random()*300)+100);   
        }
    }

    /**
     * Adds a bird in the game
     */
    addBird() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const x = direction == 1 ? 0 - Bird.SIZE : this.canvas.width;
        this.birds.push(new Bird(x, direction));
    }

    /**
     * Adds a target in the game
     */
    addTarget() {
        let newX = Math.random()*this.canvas.width;
        if (newX + Target.SIZE > this.canvas.width) {
            newX -= Target.SIZE;
        }
        this.target = new Target(newX);
    }

    /**
     * Throws an arrow by building an arrow element and adding it to the thrown arrows array
     */
    throw() {
        if (this.raf != null && this.ammo > 0) {
            this.ammo--;
            document.getElementById("nbArrows").textContent = this.ammo;
            if (this.weapon instanceof Ak) {
                if (this.canShoot) {
                    this.threw.push(new Bullet(this.weapon));
                    this.canShoot = false;
                }
                this.launchSound("./sounds/fire.mp3", 0.2);
                
            }
            else {
                this.threw.push(new Arrow(this.weapon));
                this.launchSound("./sounds/arrowFire.mp3", 0.5)
            }
        }
    }

    /**
     * Starts the animation or stop it if previously running
     */
    startAndStop() {
        if (this.raf != null) {
            document.getElementById("stopAndStartGame").textContent = "Play";
            window.cancelAnimationFrame(this.raf);
            this.raf = null;
            clearInterval(this.birdTimer);
            clearInterval(this.loaderTimer);
            clearInterval(this.bulletInterval);
        }
        else {
            document.getElementById("stopAndStartGame").textContent = "Stop";
            this.birdTimer = setInterval(() => Math.random() > 0.25 ? this.addBird() : null, 1000);
            this.loaderTimer = setInterval(() => Math.random() < 0.5 ? this.addLoader() : this.loader = null, 1500);
            this.raf = window.requestAnimationFrame(() => this.animate());
            if (this.weapon instanceof Ak) {
                this.bulletInterval = setInterval(() => this.canShoot = true, 100);
            }
        }
    }

    /**
     * Animates the game by moving all the element, checking all collisions and drawing all the element remaining after the collisions
     */
    animate() {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Handle moves, move and filter the elements out of dimension
        this.handleKeys(this.weapon);
        [...this.birds, ...this.threw].forEach(elem => elem.move(this.canvas));
        this.birds = this.birds.filter(bird => !bird.isOutOfDimension(this.canvas));
        this.threw = this.threw.filter(arrow => !arrow.isOutOfDimension(this.canvas));
        this.particles.forEach(particles => particles.filterAndMove(this.canvas));
        this.particles.forEach(part => part.particles.length > 0);
        // Check all the collisions between elements
        this.threw = this.threw.filter(arrow => !this.checkArrowCollision(arrow));
        this.checkTargetDestroy();
        this.checkLoaderCollisions();
        this.checkWeaponCollision();
        // Draw the ramining elements
        [this.weapon, this.target, ...this.birds, ...this.threw].forEach(elem => elem.draw(this.canvas));
        this.particles.forEach(particles => particles.draw(this.canvas));
        // raf
        this.raf = window.requestAnimationFrame(() => this.animate());
    }

    /**
     * Checks the collisions between an element and all the elements in an array
     * 
     * @param {Game} element The element to check
     * @param {Array} array The array of element to check collisions with the element
     * @param {Array} toDelete The array of element who must be deleted afterwards
     * @returns The amount of elements who have collisions with the element
     */
    checkArrayCollisions(element, deleteBird=false) {
        let count = 0;
        this.birds.forEach(bird => {
            if (element.checkCollisions(bird)) {
                if (deleteBird) {
                    this.particles.push(new Particles(bird.x + Bird.SIZE / 2, bird.y + Bird.SIZE / 2, true));
                    this.launchSound("./sounds/death.mp3");
                    this.birds.pop(bird);
                }
                count++;
            }
        });
        return count > 0;
    }

    /**
     * Checks if the target is destroyed by an object (collisions)
     * 
     * @returns True if the target is destroyed, else false
     */
    checkTargetDestroy() {
        let cpt = 0;
        this.threw = this.threw.filter(arrow => {
            if (arrow.checkCollisions(this.target)) {
                cpt++;
                return false;
            }
            return true;
        });
        if (cpt > 0) {
            const pointsArea = document.getElementById("score");
            pointsArea.textContent = parseInt(pointsArea.textContent) + 1000;
            this.particles.push(new Particles(this.target.x + Target.SIZE / 2, this.target.y + Target.SIZE, false));
            this.addTarget();
            this.launchSound("./sounds/targetBreak.mp3");
        }
    }

    /**
     * Checks if the quiver is destroyed by an object (collisions)
     * 
     * @returns True if the quiver is destroyed, else false
     */
    checkLoaderCollisions() {
        if (this.loader != null) {
            this.loader.draw(this.canvas);
            if (this.weapon.checkCollisions(this.loader)) {
                this.loader = null;
                if (this.weapon instanceof Bow) {
                    this.ammo = 5;
                    document.getElementById("nbArrows").textContent = this.ammo;
                }
                else {
                    this.loadersInStock++;
                    document.getElementById("nbLoaders").textContent = this.loadersInStock;
                }
            }
            else {
                if (this.checkArrayCollisions(this.loader) > 0) {
                    this.loader = null;
                    this.launchSound("./sounds/loaderRobbed.mp3");
                }
            }
        }
    }

    /**
     * Checks the bow collisions between it and an array
     * 
     * @param {Array} toDelete The array of elements that are colliding with the bow 
     */
    checkWeaponCollision() {
        const remainingLives = document.getElementById("lifes");
        let cpt = 0;
        this.birds.forEach(bird => {
            if (this.weapon.checkCollisions(bird)) {
                this.particles.push(new Particles(bird.x + Bird.SIZE / 2, bird.y + Bird.SIZE / 2, true));
                this.birds.pop(bird);
                this.launchSound("./sounds/death.mp3");
                cpt++;
            }
        });
            if (cpt > 0) {
                if (remainingLives.childElementCount == 1) {
                    alert('Perdu !');
                    window.location.reload();
                }
                else {
                    if (this.weapon instanceof Bow) {
                        this.addBow();
                    }
                    else {
                        this.addAk();
                    }
                    remainingLives.removeChild(remainingLives.firstElementChild);
                }
            }
        }

    /**
     * Checks the collisions between an arrow and an array of element
     * 
     * @param {Arrow} arrow The arrow to check collisions
     * @param {Array} toDelete The array of element who must be destroyed afterwards
     * @returns 
     */
    checkArrowCollision(arrow) {
        if (this.checkArrayCollisions(arrow, true) > 0) {
            return true;
        }
        return false;
    }

    /**
     * The handler who manage the key down events
     * 
     * @param {Event} event The event that launched the function
     */
    keyDownActionHandler(event) {
        if (event.code == "Space") {
            this.canShoot = false;
            event.preventDefault();
        }
        const actions = this.weapon instanceof Bow ? this.moveActions : [...this.akActions, ...this.moveActions];
        actions.forEach(act => {
            if (act.key === event.code) {
                act.value = true;
                event.preventDefault();
            }
        });
    }

    /**
     * The handler who manage the key up events
     * 
     * @param {Event} event The event that launched the function
     */
    keyUpActionHandler(event) {
        if (event.code == "Space" && this.weapon instanceof Bow) {
            this.throw();
            this.canShoot = true;
            event.preventDefault();
        }
        [...this.akActions, ...this.moveActions].forEach(act => {
            if (act.key === event.code) {
                act.value = false;
                event.preventDefault();
            }
        });
    }

    /**
     * The function that handles the move keys of the element
     * 
     * @param {GameElement} element The element to move
     */
    handleKeys() {
        if (this.weapon instanceof Ak) {
            if (this.akActions[0].value && this.canShoot) {
                this.throw();
                this.canShoot = false;
            }
            if (this.akActions[1].value) {
                this.reload();
            }
        }
        this.moveActions.forEach((act, i) => {
            if (act.value) {
                const value = i % 2 == 0 ? -1 : 1;
                const tuple = i / 2 < 1 ? [value, 0] : [0, value];
                this.weapon.move(this.canvas, ...tuple);
            }
        });

        /* Explication du code : [Left, Right, Up, Down]
        Pour chaque indice i dans les actions possibles, si i est divisible par deux, le coefficient de mouvement sera 1, sinon -1
        Il reste plus qu'à déterminer si ce coefficient sera utilisé en x ou en y, si i < 2 (ou i / 2 < 1), 
        la valeur sera en x, sinon en y et l'autre valeur sera 0 (pas de mouvement).
        */

        /* Autre manière de procéder plus compréhensible :

        if (this.moveActions[0])  // touche flèche gauche pressée
            element.move(this.canvas, -1, 0);
        if (this.moveActions[1]) // touche flèche droite pressée
            element.move(this.canvas, 1, 0);
        if (this.moveActions[2])  // touche flèche haut pressée
            element.move(this.canvas, 0, -1);
        if (this.moveActions[3])  // touche flèche bas pressée
            element.move(this.canvas, 0, 1);
        */
    }

    launchSound(src, volume=1) {
        if (this.sounds) {
            const sound = new Audio(src);
            sound.volume = volume;
            sound.play();
        }
    }

    backGroundSelector() {
        const PATH = "./images/";
        const tabSrc = ["decor-500", ...Array.from({ length: 5 }, (v, i) => i + 1)];
        const backgroundDiv = document.getElementById("background-selector");
        tabSrc.forEach(imgSrc => {
            const img = new Image();
            img.src = PATH + imgSrc + ".png";
            backgroundDiv.appendChild(img);
            img.style.width = "300px";
            img.style.padding = "20px";
            img.addEventListener("mouseenter", () => img.style.transform = "scale(1.05)");
            img.addEventListener("mouseleave", () => img.style.transform = "scale(1)");
            img.addEventListener("click", () => this.canvas.style.backgroundImage = `url(${img.src})`);
        })
    }
}