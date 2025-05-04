import Game from './game.js';
import Grid from './grid.js';
import Bricks from './bricks.js'
import randomBag from './utils.js';
import Input from './input.js';

let game;
let bagShuffle;
let input;
let death;
let gameover;
let grid;


function init(){

    document.removeEventListener('click', init)

    game = new Game()

    bagShuffle = randomBag(["O", "T", "I", "L", "S", "Z", "J"])

    input = new Input(game)

    death = 0;
    gameover = false;

    game.brick = (new Bricks(game, 30, 30, bagShuffle[0]))

    bagShuffle.shift()

    for (let i = 0; i < 3; i++){

        game.nextBricks.push(new Bricks(game, 30, 30, bagShuffle[0]))

        bagShuffle.shift()

    }

    grid = new Grid(game, 20, 10, game.brick.type.data)

    gameLoop()

}

function gameLoop(){

    updateBricks()

    game.clear()

    game.holdBlock(input, 150, input?.holdPiece?.type?.data)

    game.newBlock(grid, 150)

    game.update(grid, input)

    game.render(grid)

    game.points(grid)

    game.layer(input)

    if (!gameover){

        window.requestAnimationFrame(gameLoop)

    }

    else{

        game.clear()
        game.end()

    }

}

function updateBricks(){

    if (game.brick.state === 2 || input.hold && !input.paused){

        game.nextBricks.push(new Bricks(game, 30, 30, bagShuffle[0]))

        bagShuffle.shift()

        if (bagShuffle.length === 0){

            bagShuffle = randomBag(["O", "T", "I", "L", "S", "Z", "J"]);
        }

        death = game.brick.position.y;

        game.brick = game.nextBricks[0];
        game.nextBricks.shift()

        if (game.brick.y >= death && !input.hold){

            gameover = true;

            if (game.score > game.highscore){

                game.highscore = game.score;
                localStorage.setItem('highscore', game.highscore)

            }

            document.addEventListener('click', init)


        }

        input.swap = true; 
        input.hold = false;

    }

}

init()