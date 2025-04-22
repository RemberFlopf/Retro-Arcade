let highscore = parseInt(localStorage.getItem("highscore")) || 0;

class Game{

    constructor(){

        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;
        
        this.player = undefined;
        this.bricks = new Set();

        this.score = 0;

        this.balls = new Set();
        this.lives = 3;
        this.deathDelay = 0;
        this.end = false;

        this.displayMultiplier = 0;

        this.restart = this.restart.bind(this)
    }

    erase(){

        if (this.end === false){

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        }
            
    }

    drawText(text, posX, posY, size, colour, font){

        for (let b of this.balls){

            let xDistance = Math.abs(posX - b.x)
            let yDistance = Math.abs(posY - b.y)

            this.ctx.globalAlpha = xDistance/this.canvas.width + yDistance/this.canvas.height;

        }

        this.ctx.fillStyle = colour
        this.ctx.font = size+'px '+font
        this.ctx.fillText(text, posX, posY)

        this.ctx.globalAlpha = 1;



    }

    death(){

        for (let s of this.balls){

            if (s.y + s.radius > this.canvas.height){

                this.balls.delete(s)
                this.player.speed -= 1;
        
            }

        }

        if ((this.balls.size === 0 && this.lives != 0) || this.brickManager.breached){

            this.lives -= 1;

            if (this.lives === 0){

                for (let b of this.bricks){
                
                    setTimeout(() =>{

                        this.bricks.delete(b)

                    }, this.deathDelay)

                    this.deathDelay += 10;

                }

                setTimeout(() => {

                    if (highscore < this.score){
                        highscore = this.score;
                        localStorage.setItem('highscore', highscore)
                    }

                    this.player.reset()
                    for (let b of this.balls){
                        b.reset()
                    }
                    this.end = true; 
                    this.erase()
                    this.drawText('GAME OVER!', 450, 200, '50', 'serif')
                    this.drawText(`Score: ${this.score}`, 570, 250, '20', 'serif')
                    this.drawText(`Highscore: ${highscore}`, 555, 275, '20', 'serif')

                    document.addEventListener('keydown', this.restart)
                }, 5000)


            }

            else{

                this.balls.add(new Ball(500, 400, 10, 'white'))

            }


        }

    }

    restart(e){

        if (e.key === ' '){

            document.removeEventListener('keydown', this.restart)

            game = new Game()

            game.init()

        }

    }

    init(){

        this.player = new Paddle(500, 420, 100, 10, 'white')
        this.brickManager = new BrickManager()

        this.brickManager.createBricks(10, 35)

        this.brickManager.colour = 0;

        this.balls.add(new Ball(500, 400, 10, 'white'))

        gameLoop()

    }

    update(){

        this.player.moveHandle();

        [...this.balls].forEach((b, index) =>{
            
            b.move()

            if (b.vx === 0 && b.vy === 0){
                b.attachPaddle()
            }


            if (b.multiplier > 2){

                game.drawText(`${b.multiplier}x`, game.player.x + 25 * index, game.player.y + 30, "20", b.colour, '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif')
        
            }


        })

        for (let b of this.bricks){

            b.checkMove(b)
        }

    }

    render(){

        this.player.draw()

        for (let b of this.balls){

            b.draw()

        }

        for (let b of this.bricks){

            b.draw()
        }

        this.brickManager.creator = false;

    }
}

let game = new Game()


/*

deltaTime

deltaTime = performance.now() - lastTime /1000
lastTime = performance.now()

*/


class GameObject{

    constructor(x, y, width, height, colour){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.radius = this.width;

        this.ctx = game.ctx;

    }

    draw(shape){

        this.ctx.fillStyle = this.colour;
        if (shape === 'rect'){

            this.ctx.fillRect(this.x, this.y, this.width, this.height)

        }

        else if (shape === 'arc'){

            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            this.ctx.fill()

        }

    }
    

}

class Paddle extends GameObject{

    constructor(x, y, width, height, colour){

        super(x, y, width, height, colour)

        this.dx = 0;
        this.dy = 0;

        this.speed = 5;

        this.controls = ['ArrowLeft', 'ArrowRight', 'ArrowUp']

        this.inputs = new Set()
        this.inputOrder = [];

        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)

        document.addEventListener('keydown', this.keyDown)
        document.addEventListener('keyup', this.keyUp)

    }

    draw(){

        super.draw('rect')

    }

    keyDown(event){

        if (event.key === this.controls[0] || event.key === this.controls[1]){

            this.inputOrder.unshift(event.key)

        }

        this.inputs = new Set(this.inputOrder)

    }

    keyUp(event){

        this.inputs.delete(event.key)

        this.inputOrder = Array.from(this.inputs)

    }

    moveHandle(){

        if (this.inputOrder[0] === this.controls[0] && this.x > 0){
            this.dx = -this.speed;
        }

        else if (this.inputOrder[0] === this.controls[1] && this.x < game.canvas.width - this.width){
            this.dx = this.speed;
        }

        else{
            this.dx = 0;
        }

        this.move()

    }

    move(){

        this.x += this.dx;
        this.y += this.dy;

        this.draw()

    }

    reset(){

        document.removeEventListener('keydown', this.keyDown)
        document.removeEventListener('keyup', this.keyUp)

        this.inputOrder.length = 0;
        this.inputs.clear()

    }

}

class Bricks extends GameObject{

    constructor(x, y, width, height, colour, trueX, trueY){
        super(x, y, width, height, colour);

        this.trueX = trueX;
        this.trueY = trueY;
        this.spacing = 3;

        this.x = (this.width + this.spacing) * trueX + 25;
        this.y = (this.height + this.spacing) * trueY + 30;

        this.movementCounter = 0;

        this.bonus = 0;

    }

    draw(){

        super.draw('rect')
        this.drawBonus()

    }

    drawBonus(){

        if (this.bonus !=  0){


            
        this.ctx.beginPath()

        this.ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/3.5, 0, 2 * Math.PI)

        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = 'white'
        
        this.ctx.fill()

        this.ctx.stroke()

        this.ctx.globalAlpha = 1;

        }
    }

    move(){

        this.y += (this.height + this.spacing)

        if (this.y > game.player.y){
            game.brickManager.breached = true;
        }

    }

    checkMove(){

        game.brickManager.drop = 4000 - game.player.speed * 100;

        if (game.brickManager.drop < 500){
            game.brickManager.drop = 500;
        }

        if (this.movementCounter > game.brickManager.drop){

            this.movementCounter = 0;

            this.move()

            if (game.brickManager.creator === false){

                game.brickManager.creator = true;
                game.brickManager.colour += 1

                if (game.brickManager.colour > 9){
                    game.brickManager.colour = 0;
                }

                game.brickManager.createBricks(1, 35)
            }
        }

        this.movementCounter += 1
    }


}

class BrickManager{

    constructor(){

        this.drop = 0;
        this.bonusActive = 0;

        this.colours = ['red', 'orange', 'yellow', 'greenyellow', 'limegreen', 'lightseagreen', 'teal', 'blueviolet', 'darkviolet', 'indigo'];

        this.colour = 0;

        this.creator = false;

        this.breached = false;
        this.bricksCreated = 0;
        this.bricksPrevious = 0;

        this.bonusAssign = Math.round(Math.random() * 58);
    }

    powerInit(){

        [...game.bricks].forEach((b, i) =>{

            if (i === this.bonusAssign){

                this.bonusActive ++

                b.bonus = this.bonusActive;
                
                this.bonusAssign = RandomIntRange(0 + (this.bonusActive * 58), 58 + (this.bonusActive * 58))
            }
        })

    }   

    createBricks(rows, columns){

        this.bricksPrevious = game.bricks.size;

        for (let j = 0; j < rows; j ++){

            if (this.creator === false){

                this.colour = j;

            }

            for (let i = 0; i < columns; i ++){
                game.bricks.add(new Bricks(0, 0, 30, 20, this.colours[this.colour], i, j))
            }
        
        }

        this.bricksCreated = game.bricks.size;
        this.powerInit()
    }

}

class Ball extends GameObject{

    //x, y, radius, startAngle, endAngle, counterclockwise?

    constructor(x, y, radius, colour, opacity){

        super(x, y, radius, radius, colour)

        this.vx = 0;
        this.vy = 0;

        this.speed = 4;

        this.multiplier = 1;
        this.multiplierStart = 0;

        this.trail = [];

        this.multi = 0;

        this.startMovement = this.startMovement.bind(this)

        document.addEventListener('keydown', this.startMovement)

        this.startMovement('undefined')
    }

    draw(){

        super.draw('arc')

    }

    move(){

        this.collisionLogic()
        this.wallCollision()

        this.trail.unshift({x : this.x, y : this.y})

        if (this.trail.length > 20){
            this.trail.pop()
        }

        this.x += this.vx;
        this.y += this.vy;

        for (this.i = 0; this.i < this.multiplier; this.i ++){

            this.ctx.globalAlpha = 0.5;
            this.ctx.fillStyle = this.colour;
            this.ctx.beginPath();

            while(this.trail.length <= this.i){

                this.trail.unshift({x : this.x, y : this.y})

            }

            this.ctx.arc(this.trail[this.i].x, this.trail[this.i].y, this.radius, 0, 2 * Math.PI)

            this.ctx.fill()

            this.ctx.globalAlpha = 1;


        }

    }

    attachPaddle(){

        this.x = game.player.x + game.player.width/2;
        this.y = game.player.y - 15;

    }

    startMovement(event){

        if (this.colour != 'white'|| event.key === game.player.controls[2] ){

            document.removeEventListener('keydown', this.startMovement)

            this.vx = Math.random() < 0.5 ? -2 : 2;
            this.vy = Math.random() < 0.5 ? -2 : 2;

        }

    }

    reset(){

        document.removeEventListener('keydown', this.startMovement)
        game.balls.clear()

    }

    //===================== COLLISION STUFF ================================

    closeEnough(n1, n2, epsilon){

        return Math.abs(n1 - n2) < epsilon

    }

    collisionLogic(){
        
        for (let b of game.bricks){

            if (this.detectCollision(b)){

                if(b.bonus != 0){

                    game.balls.add(new Ball(b.x, b.y, 8, b.colour, 1))
                    game.player.speed += 1;

                }

                this.multiplierStart += 1;

                game.bricks.delete(b)
                game.player.speed += 0.01;

                if (this.multiplierStart > 2){

                    this.multiplier += 1;

                }

                this.speed += 0.1;

                switch(b.colour){

                    case 'red':
                        game.score += 10 * this.multiplier;
                        break;

                    case 'orange':
                        game.score += 9 * this.multiplier;
                        break;

                    case 'yellow':
                        game.score += 8 * this.multiplier;
                        break;

                    case 'greenyellow':
                        game.score += 7 * this.multiplier;
                        break;

                    case 'limegreen':
                        game.score += 6 * this.multiplier;
                        break;

                    case 'lightseagreen':
                        game.score += 5 * this.multiplier;
                        break;

                    case 'teal':
                        game.score += 4 * this.multiplier;
                        break;
                    
                    case 'blueviolet':
                        game.score += 3 * this.multiplier;
                        break;

                    case 'darkviolet':
                        game.score += 2 * this.multiplier;
                        break;

                    case 'indigo':
                        game.score += 1 * this.multiplier;
                        break;
                }

            }

        }

        this.detectCollision(game.player)
    }

    detectCollision(b){

        if (

            (
                this.x + this.radius >= b.x &&
                this.x - this.radius <= b.x + b.width &&
                this.y + this.radius >= b.y &&
                this.y - this.radius <= b.y + b.height
            )

        ){

            if (b === game.player){

                clearTimeout(this.multi)

                this.multiplier = 1;
                this.multiplierStart = 0;

                this.vx = ((this.x - (game.player.x + game.player.width/2))/25) + game.player.dx/5;
                this.vy = -(this.speed - Math.abs(this.vx))

                game.speed += 0.01;

                return true;

            }

            //check which side of bricked is hit and change direction accordingly 

            if (this.closeEnough(this.y - this.radius, b.y + b.height, Math.abs(this.vy))){
                this.vy = Math.abs(this.vy);

            }

            else if (this.closeEnough(this.y + this.radius, b.y, Math.abs(this.vy))){

                this.vy = -Math.abs(this.vy)

            }

            else{

            if (this.closeEnough(this.x - this.radius, b.x + b.width, Math.abs(this.vx))){

                this.vx = Math.abs(this.vx);
            }

            else if (this.closeEnough(this.x + this.radius, b.x, Math.abs(this.vx))){

                this.vx = -Math.abs(this.vx)

            }

            }

            clearTimeout(this.multi)

            this.multi = setTimeout(() => {this.multiplier -= 1; if (this.multiplier < 2){this.multiplierStart = 0;}}, 3000 - this.multiplier * 200)

            return true;

        }

        return false;


    }

    wallCollision(){

        if(this.x > game.canvas.width - this.radius){

            this.vx = -Math.abs(this.vx)

        }

        if(this.x < 0 + this.radius){

            this.vx = Math.abs(this.vx)

        }

        if (this.y < 0 + this.radius){

            this.vy = Math.abs(this.vy)

        }

    }

    //=======================================================================


}

function gameLoop(){

    game.erase()

    game.update()
    game.render()

    game.drawText(`Score: ${game.score}`, 15, 15, "15", 'white', 'serif')
    game.drawText(`Lives: ${game.lives}`, game.canvas.width - 60, 15, "15", 'white', 'serif')

    game.death()

    if (game.end === false){

        window.requestAnimationFrame(gameLoop)

    }
}

function ConvertColour(colour){

    let div = document.createElement('div')
    div.style.color = colour;
    document.body.appendChild(div)
    return window.getComputedStyle(div).color;

}

function RandomIntRange(min, max){

    return Math.floor(Math.random() * (max - min + 1) + min);

}

game.init()