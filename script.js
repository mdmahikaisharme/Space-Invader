/* --------------- DOM --------------- */
const ground = document.getElementById("ground");
const score = document.getElementById("score");
const player = document.getElementsByClassName("player")[0];




/* --------------- Global --------------- */
// temp
let _ = {};

// size will be come from stylesheet
const sizeGround = { w: ground.offsetWidth, h: ground.offsetHeight };
const sizePlayer = { w: player.offsetWidth, h: player.offsetHeight };
const sizeBullet = { w: 10, h: 20 };
const sizeEnemy = { w: 50, h: 50 };
// centering player's x && 10px gap from bottom
let posPlayer = { 
    x: (sizeGround.w/2) -(sizePlayer.w /2),
    y: sizeGround.h -sizePlayer.h -10
};

let lenEnemy = 5;
let speedFire = 30;

let displayUpdateInterval;
let intervalTime = 30;
let isGameOver = false;




/* --------------- Short Hand --------------- */
const vect = (x, y) => { return { x, y } };
const posi = (element) => {
    return {
        x: Number(element.style.left.replace("px", '')),
        y: Number(element.style.top.replace("px", ''))
    };
};




/* --------------- Class --------------- */
// player
class Player {
    // start work
    start() {
        // set up player position
        player.style.top = posPlayer.y +"px";
        player.style.left = posPlayer.x +"px";

        // show playe in DOM
        player.style.opacity = 1;

        // keydown event listener
        document.addEventListener("keydown", (event) => { !isGameOver && this.control(event.key) });
    }

    // handle hole things by using event's key
    control(key) {
        if (key === "ArrowLeft") { this.moveLeft() }
        else if (key === "ArrowRight") { this.moveRight() }
        else if (key === " ") { this.fireBullet() };
    };

    // move the player left
    moveLeft() {
        posPlayer.x -= sizePlayer.w;
        // passed ground left
        if (posPlayer.x <= 0) { posPlayer.x += sizePlayer.w } 
        player.style.left = posPlayer.x +"px";
    };

    // move the player right
    moveRight() {
        posPlayer.x += sizePlayer.w;
        // passed ground right
        if (posPlayer.x >= (sizeGround.w-sizePlayer.w)) { posPlayer.x -= sizePlayer.w } 
        player.style.left = posPlayer.x +"px";
    };

    // fire a bullet
    fireBullet() {
        let fireTimer;
        let posFire = { x: posPlayer.x +(sizePlayer.w/2) -5, y: posPlayer.y };
    
        // Fire DOM
        let fireDOM = document.createElement("div");
        // set position
        fireDOM.style.top = posFire.y +"px";
        fireDOM.style.left = posFire.x +"px";
        // add class
        fireDOM.className = "bullet";
        // append in DOM
        ground.appendChild(fireDOM);
        
        // move fire interval
        fireTimer = setInterval(() => {
            // moving top
            posFire.y -= sizeBullet.h;  
            fireDOM.style.top = posFire.y +"px";
            // passed top of ground
            if (posFire.y <= -sizeBullet.h) {
                clearInterval(fireTimer)
                fireDOM.remove()
            };
        }, speedFire);    
    };
};


// enemy
class Enemy {
    // start work
    start() {
        // create first enemey
        this.createPart(vect(sizeGround.w, 10));
        setInterval(() => this.createPart(vect(sizeGround.w, 10)), 1500);
    };

    // move enemy
    move() {
        [...document.getElementsByClassName("enemy")].forEach(i => {
            // getting position
            _ = posi(i);
            // move left
            _.x -= 2;

            // passed left
            if (_.x <= -sizeEnemy.w) { 
                // new position
                _.x += sizeGround.w +sizeEnemy.w +20;
                _.y += sizeEnemy.h +20;

                // pass ground bottom
                if (_.y > (sizeGround.w -100)) {
                    // make game over
                    isGameOver = true;
                    // update title
                    document.getElementById("title").innerText = "Enemy Close To Player";
                };
                // move from top
                !isGameOver && (i.style.top = _.y +"px");
            };
            i.style.left = _.x +"px";
        });
    };

    // create a new enemy
    createPart(pos) {
        // create new part
        const part = document.createElement("div");
        // setup position
        part.style.top = pos.y +"px";
        part.style.left = pos.x +"px";
        // add class
        part.className = "enemy";

        // append
        ground.append(part);
    };
};


// main
class Main {
    constructor() {
        this.player = new Player();
        this.enemy = new Enemy();
    };

    // start work
    start() {
        this.player.start();
        this.enemy.start();
    };

    // update 
    update() {
        this.collision();
        this.enemy.move();
    };

    // collision
    collision() {
        // get all bullets
        [...document.getElementsByClassName("bullet")].forEach(i => {
            // get all enemys
            [...document.getElementsByClassName("enemy")].forEach((j, index) => {
                // get the position i(bullet) j(enemy)
                _ = { "i": posi(i), "j": posi(j) };
                if (
                    _.i.x > _.j.x &&
                    _.i.x < (_.j.x +sizeEnemy.w) &&
                    _.i.y < _.j.y &&
                    _.i.y < (_.j.x +sizeEnemy.h)
                ) {
                    // remove from DOM
                    j.remove();
                    i.remove();
                    // update score
                    score.innerText = Number(score.innerText) +1;
                };
            });
        });
    };
};




/* --------------- Function --------------- */
// all those things thats are occered, when the game start
const startGame = () => {
    // get main
    const main = new Main();
    // start main's work
    main.start();
    // update display
    displayUpdateInterval = setInterval(() => { !isGameOver && main.update() }, intervalTime);
};




/* --------------- Run --------------- */
startGame();