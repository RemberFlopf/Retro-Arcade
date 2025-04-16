console.clear()

class Game{

    constructor(){
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.canvas.width = canvas.getBoundingClientRect().width;
        this.canvas.height = canvas.getBoundingClientRect().height;

        this.ctx.lineWidth = 2;

        this.restart = this.restart.bind(this)

        this.begin = this.begin.bind(this)

        this.lightgreen = false;

        this.hello = true;

        this.amountPlayers = 1;

        this.stop = false;

        this.listener_goaway = false;
    }

    death(){

        for(let s of snakes){

            if (s.x < 0 || s.y < 0 || s.x > this.canvas.width - s.width || s.y > this.canvas.height - s.height || this.collide(s) || this.people(s)){

                if (s.shield){
                    setTimeout(() => {s.shield = false;}, 2000)
                    s.colour = 'green';
                    setTimeout(() => {s.colour = 'lightblue'}, 750)
                    setTimeout(() => {s.colour = 'green'}, 1500)
                }
                
                else{

                    if (s.colour != 'white'){
                        this.amountPlayers -= 1;
                    }

                    document.removeEventListener('keydown', s.input)

                    s.colour= 'white'

                    this.ctx.clearRect(s.x, s.y, 20, 20)

                    if (!multiPlayer || this.amountPlayers === 1){

                        this.ctx.clearRect(food.x, food.y, 20, 20)

                        if (!this.listener_goaway){

                            this.listener_goaway = true;

                            setTimeout(() => {

                            document.addEventListener('click', this.restart)
                            document.addEventListener('keyup', this.begin)

                            }, s.segments.length * 40)

                        }

                    }

                }
            }

        }
    }

    restart(){

        document.removeEventListener('click', this.restart)
        document.removeEventListener('keyup', this.begin)

        window.location.reload()

    }

    begin(e){

        if (e.key === ' '){

            document.removeEventListener('click', this.restart)
            document.removeEventListener('keyup', this.begin)
            
            if (multiPlayer === 1){

                this.stop = true;

                for (let s of snakes){

                    s.eaten = 1;

                    while (s.segments.length >= 2){

                        s.segments.pop()
                        s.segments.pop()

                    }

                    powerup.active = false;

                    if(s.colour != 'white'){

                        s.points += 1;

                    }
                    
                    switch(s.id){

                        case 1:
                            s.colour = 'green'

                            s.x = 40;
                            s.y = 40;

                            break;

                        case 2:
                            s.colour = 'aqua'

                            s.x = 1140;
                            s.y = 420;
                            break;

                        case 3:
                            s.colour = 'yellow'

                            s.x = 40;
                            s.y = 420;
                            break;

                        case 4:
                            s.colour = 'pink'
                            s.x = 1140;
                            s.y = 40;
                            break;


                    }

                    s.dx = 0;
                    s.dy = 0;

                    s.counter = 0;
                    s.check = 6;

                    document.addEventListener('keydown', s.input)
                }

                setTimeout(() => {this.stop = false; this.listener_goaway = false; this.amountPlayers = snakes.length; gameLoop();}, 1000)

            }

            else{

               player = null;

               player = new Snake(40, 40, 20, 20, 'green', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Control', 'Shift'], 1) 
               
               player.init()
               food.random()

               snakes.pop()

               snakes.unshift(player)

               this.listener_goaway = false;

               document.removeEventListener('click', this.restart)
               document.removeEventListener('keyup', this.begin)

            }

        }

    }

    collide(s){

        if (s.dx != 0 && s.dy != 0){

            for (let c = 0; c < s.segments.length; c += 2){

                if (s.x === s.segments[c] && s.y === s.segments[c + 1]){

                    return true;
                }
            }

        }

        return false;

}

    people(s){

        if (multiPlayer){

            for (let c of snakes){

                if (c != s){

                    if ((c.x === s.x && c.y === s.y)){
                        return true;
                    }

                    for (let i = 0; i < c.segments.length; i+= 2){
                        if (s.x === c.segments[i] && s.y === c.segments[i + 1]){
                            console.log(s)
                            return true;
                        }
                    }

                }

            }

        }

    }

    /*randomColour(){
        return 'hsl(' + (Math.floor(Math.random() * 359)) + ' 100% 50%)'
    }*/

    randomPower(number){
        
        switch(Math.round(Math.random() * number)){

            case 0:
                powerup.colour = 'lightblue';
                break;

            case 1:
                powerup.colour = 'yellow';
                break;

            case 2:
                powerup.colour = 'blue';
                break;

            case 3:
                powerup.colour = 'magenta';
                break;

            case 4:
                game.lightgreen = true;
                this.randomPower(3.49)
                break;

            case 5:
                powerup.colour = 'purple';
                break;

        }
    }
}

let game = new Game()

class Snake{

    constructor(x, y, width, height, colour, controls, id){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = game.ctx;

        this.id = id

        this.controls = controls;

        this.colour = colour;

        this.dx = 0;
        this.dy = 0;

        this.segments = [];

        this.eaten = 1;

        this.input = this.input.bind(this)

        this.inputQueue = [];

        this.active = false;

        this.teleport_shadow = false;

        this.check = 6;

        this.shield = false;
  
        this.counter = 0;

        this.disappear = undefined;

        this.weapon_shadow = false;

        this.points = 0;

        //give input function acces to 'this'
    }

    draw(){

        this.ctx.fillStyle = this.colour;
        this.ctx.globalAlpha = 1;

        this.ctx.fillRect(this.x, this.y, this.width, this.height)
        this.ctx.strokeRect(this.x, this.y, this.width, this.height)
        
    }

    move(){

        this.x += this.dx;
        this.y += this.dy;

        this.ld = 0;

    }

    body(){

        if (this.dx != 0 || this.dy != 0){

            this.segments.unshift(this.x, this.y)

            if (this.segments.length/2 > this.eaten){
                this.segments.pop()
                this.segments.pop()
            }

        }

        //console.log(this.segments)

    }

    init(){
        document.addEventListener("keydown", this.input)
    }

    input(event){

        this.inputQueue.push(event.key)

        if(this.inputQueue.length > 3){
            this.inputQueue.pop()
        }
    
    }

    queue(){

        if (this.inputQueue[0] === this.controls[0] && this.dy === 0 && this.ld === 0){

            this.dy = -20;
            this.dx = 0;
            this.ld = 1;

        }

        if (this.inputQueue[0] === this.controls[1] && this.dy === 0 && this.ld === 0){

            this.dy = 20;
            this.dx = 0;

            this.ld = 1;
        }

        if (this.inputQueue[0] === this.controls[2] && this.dx === 0 && this.ld === 0){

            this.dx = -20;
            this.dy = 0;

            this.ld = 1;
        }

        if (this.inputQueue[0] === this.controls[3] && this.dx === 0 && this.ld === 0){


            this.dx = 20;

            
            this.dy = 0;

            this.ld = 1;
        }

        this.inputQueue.shift()

    }

}

class Food extends Snake{

    draw(){

        super.draw()

    }

    random(){

        do{

        this.x = Math.ceil(Math.random()*(canvas.width - 20))
        this.y = Math.ceil(Math.random()*(canvas.height - 20))

        }while ((this.x % 20 != 0 || this.y % 20 != 0) || this.touchSnake())

    }

    touchSnake(){

        for(let s of snakes){

            if ((s.x === this.x && s.y === this.y)){
                return true;
            }

            for (let i = 0; i <= s.segments.length; i += 2){

                if (this.x === s.segments[i] && this.y === s.segments[i + 1]){
                    return true;
                }

            }

        }

        
    return false;

}

    eat(power){

        for(let s of snakes){

            if (s.x === this.x && s.y === this.y){

                s.eaten += 1;

                this.random()

                if (s.check > 1){

                    s.check -= 0.1;

                }

                if (power){

                    switch(powerup.colour){
                        case 'yellow':
                            s.eaten += 5;
                            break;

                        case 'lightblue':
                            s.shield = true;
                            s.colour = 'lightblue'
                            setTimeout(() => {s.shield = false; s.colour = 'green'}, 60000)
                            break;

                        case 'blue':
                            s.check += 2;
                            break;

                        case 'purple':
                            s.weapon_shadow = true;

                            document.addEventListener('keydown', this.attack)
                            break;

                        case 'lightgreen':

                            for (let i = 0; i < 20; i++){
                                if (s.check > 1){
                                    s.check -= 0.1;
                                }
                            }

                            for (let i = 0; i < 10; i++){
                                if (s.segments.length/2 > 1){
                                    s.eaten -= 0.5
                                    s.segments.pop()
                                }
                            }
                            

                            break;

                        case 'magenta':

                            s.teleport_shadow = true;

                            document.addEventListener('keydown', this.teleport)
                            break;

                    }
                    powerup.active = false;


                }

            }

        }

    }

    teleport(e){

        for(let s of snakes){

            if ((e.key === ' ' && multiPlayer === 0) || (multiPlayer === 1 && (e.key === s.controls[4]) || (e.key === s.controls[4]))) {

                s.teleport_shadow = false;
                document.removeEventListener('keydown', food.teleport)
                s.x = s.x + s.dx * 10;
                s.y = s.y + s.dy * 10;   

            }

        }
    }

    attack(e){
        for(let s of snakes){

            if (multiPlayer === 1 && (e.key === s.controls[5]) || (e.key === s.controls[5])) {
                    s.weapon_shadow = false;
                    document.removeEventListener('keydown', food.attack)

                    game.ctx.clearRect(s.x, s.y, xWeapon, yWeapon);

                    for (let c of snakes){
                            if (c != s){

                                for (let h = 0; h < c.segments.length; h += 2){

                                    if (s.dx != 0){
  
                                        if (s.y === c.segments[h + 1]){
                                            c.segments.splice(h, 2)
                                            c.eaten -= 1;
                                        }
                                    }

                                    else if (s.dy != 0){
                                        
                                        if (s.x === c.segments[h]){
                                            c.segments.splice(h, 2)
                                            c.eaten -= 1
                                        }
                                    }

                                }
                            }
                    }

            }

        }
    }

    powerUp(){

        if (powerup.active === true || Math.ceil(Math.random() * 800) === 6){

            if (powerup.active === false){
                clearTimeout(this.disappear)
                this.disappear = setTimeout(() => {powerup.active = false; powerup.random()}, 40000)
                game.randomPower(4.49 + multiPlayer)
            }

            powerup.active = true; 

            powerup.draw()
    
            powerup.eat(true)
    
        }

    }

}

let snakes = [];

let player = new Snake(40, 40, 20, 20, 'green', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Control', 'Shift'], 1)

let player2;

let player3;

let player4;

let food = new Food(0, 0, 20, 20, 'red')

let powerup = new Food(0, 0, 20, 20, 'blue')

snakes.unshift(player)


let multiPlayer;
let players = document.getElementsByClassName('player');
let peopel = document.getElementsByClassName('difficulty');

let explanation = document.getElementsByClassName('controls');

let difficulty = document.getElementById('difficulty')

let xWeapon;
let yWeapon;

function gameLoop(){

    game.ctx.clearRect(0, 0, canvas.width, canvas.height)

    powerup.powerUp()

    //Try to activate a powerup then draw and eat food

    food.eat(false)

    food.draw()

    for(let s of snakes){

        if (game.stop === true){
            game.ctx.font = '15px serif'
            game.ctx.fillStyle = "white"
            game.ctx.fillText(s.points, s.x + 6, s.y - 14)
        }
    

        if (s.teleport_shadow){

            game.ctx.globalAlpha = 0.4;
            game.ctx.fillStyle = 'magenta';
            game.ctx.fillRect(s.x + s.dx * 10, s.y + s.dy * 10, 18, 18);
    
        }

        if (s.weapon_shadow){

            game.ctx.globalAlpha = 0.4;
            game.ctx.fillStyle = 'red';

            xWeapon = 50 * s.dx
            yWeapon = 50 * s.dy

            if (xWeapon === 0){
                xWeapon += 20;
            }

            else if (yWeapon === 0){
                yWeapon += 20;
            }

            game.ctx.fillRect(s.x, s.y, xWeapon, yWeapon);
    
        }

        if (s.counter > s.check){

            s.counter = 0;

            s.queue()

            s.body()

            s.move()

            //Queue inputs, save segment pos and move snakes

            let xDistance = powerup.x - s.x;
            let yDistance = powerup.y - s.y;

            if ((xDistance < 60 && xDistance > -60) && (yDistance < 60 && yDistance > -60) && game.lightgreen){
                game.lightgreen = false;
                powerup.colour = 'lightgreen'

                //Reveal trap power up
            }

        }

        s.counter += 1;

        s.draw()

        for (let i = 0; i < s.segments.length; i += 2){

            //Draw segments yay for array

            game.ctx.fillRect(s.segments[i], s.segments[i + 1], 20, 20) 
            game.ctx.strokeRect(s.segments[i], s.segments[i + 1], 20, 20)

        }

    }

    game.death()

    //Die then loop this function with an animation frame (makes movement clean for some reason idk)

    if (game.stop === false){

        window.requestAnimationFrame(gameLoop)

    }

}

function multiplayer(bot){

    difficulty.style.display = 'unset'
    
    for (let i = 0; i < players.length; i ++){
        players[i].style.display = "none";
    }

    if (bot === 0){

        difficulty.style.display = 'none'
        multiPlayer = 0;

        powerup.random()

        food.random()
        
        player.init()

        game.canvas.style.display = 'flex';
    
        gameLoop()
    }

    else{

        for (let i = 0; i < explanation.length; i ++){
            explanation[i].style.display = "unset";
        }
    
            
        for (let i = 0; i < peopel.length; i ++){
            peopel[i].style.display = "unset";
        }

        multiPlayer = 1;
    }

}

function numberOfPeople(count){

    
    difficulty.style.display = 'none'


    for (let i = 0; i < peopel.length; i ++){
        peopel[i].style.display = "none";
    }

    for (let i = 0; i < explanation.length; i ++){
        explanation[i].style.display = "none";
    }


    if (count >= 2){

        player2 = new Snake(1140, 420, 20, 20, 'aqua', ['w', 's', 'a', 'd', 'q', 'e'], 2);
        snakes.unshift(player2)

    }

    if (count >= 3){
        player3 = new Snake(40, 420, 20, 20, 'yellow', ['i', 'k', 'j', 'l', 'u', 'o'], 3)
        snakes.unshift(player3)
    }

    if (count === 4){
        player4 = new Snake(1140, 40, 20, 20, 'pink', ['t', 'g', 'f', 'h', 'r',' y'], 4)
        snakes.unshift(player4)
    }

    game.amountPlayers = count;

    powerup.random()

    food.random()

    for(let s of snakes){

        s.init()

    }

    game.canvas.style.display = 'flex';

    gameLoop()
}