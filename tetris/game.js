export default class Game{

    constructor(){

        this.canvas = document.getElementById('canvas')
        this.nextBlock = document.getElementById('nextBlock')
        this.holdPiece = document.getElementById('hold')
        this.c = this.holdPiece.getContext('2d')
        this.ctx = this.canvas.getContext('2d');
        this.context = this.nextBlock.getContext('2d')

        this.textScore = document.getElementById('score')
        this.textLevel = document.getElementById('level')
        this.textLines = document.getElementById('lines')

        this.dpr = window.devicePixelRatio || 1;

        this.logicalWidth = 300;
        this.logicalHeight = 600;

        this.brick = 0;

        this.x = 0;
        this.y = 0;

        this.level = 1;

        this.highscore = parseInt(localStorage.getItem("highscore")) || 0;
        this.score = 0;

        this.pos = 1;

        this.containsSquare = false;

        this.nextBricks = [];

        this.brickShuffle = 0;

        this.speedTable = [48, 45, 39, 32, 29, 23, 15, 13, 10, 7, 5, 5, 4, 4, 3, 3, 2, 1];

        this.newestBrick = 0;
                
        this.canvas.width = this.logicalWidth  * this.dpr;
        this.canvas.height = this.logicalHeight * this.dpr;

        this.ctx.scale(this.dpr, this.dpr)
              
        this.nextBlock.width =  150 * this.dpr;
        this.nextBlock.height =  300 * this.dpr;

        this.context.scale(this.dpr, this.dpr)

        this.holdPiece.width =  150 * this.dpr;
        this.holdPiece.height =  100 * this.dpr;

        this.c.scale(this.dpr, this.dpr)

        this.canvas.style.width = `${this.logicalWidth}px`;
        this.canvas.style.height = `${this.logicalHeight}px`;
    }

    clear(){

        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight)
        this.context.clearRect(0, 0, 150, 350)

        this.c.clearRect(0, 0, 150, 100)

    }

    end(){

        this.ctx.fillStyle = 'white'
        this.ctx.font = '30px serif'
        this.ctx.fillText('Score : '+ this.score, 75, 285)
        this.ctx.fillText('Highscore : '+ this.highscore, 60, 315)

    }

    layer(input){

        if (!input.downPressed){

            input.dropSpeed = this.speedTable[this.level - 1];

        }

    }

    newBlock(grid, width){

        this.y = 0;

        if (this.nextBricks[2].type.data.length <= 2){

            this.y -= 30;

        }

        for (let i = 0; i < 3; i++){

            this.y += 30

            this.context.fillStyle = this.nextBricks[i].type.colour;

            this.nextBricks[i].type.data.forEach((row, rowIndex) => {

                if (this.containsSquare){  

                    this.y += 30;

                }

                this.containsSquare = false;
                
                row.forEach((square, squareIndex) => {
                
                    if (square === 1){

                        this.containsSquare = true;

                        this.pos = (width/30)/2 - row.length/2;

                        this.x = (squareIndex + this.pos) * 30;

                        this.context.fillRect(this.x, this.y, 30, 30)
                        this.context.strokeRect(this.x, this.y, 30, 30)
    
                    }
    
                });
    
            });

        }

    }

    points(grid){

        this.textScore.textContent = this.score;
        this.textLevel.textContent = this.level;
        this.textLines.textContent = grid.totalLinesCleared;
    }

    holdBlock(input, width, rotate){

        rotate?.forEach((row,rowIndex) => {

            row.forEach((square, squareIndex) =>{

                if (square === 1){


                    this.c.fillStyle = input.holdPiece.type.colour;

                    this.x = (squareIndex + (width/30)/2 - row.length/2) * 30;

                    this.y = (rowIndex + (100/30)/2 - rotate.length/2) * 30;

                    if (this.y + 30 > 100){

                        this.clear()

                        console.log('Roate')

                        this.holdBlock(input, 150, this.brick.rotateMatrix(input.holdPiece.type.data))

                    }


                    this.c.fillRect(this.x, this.y, 30, 30)
                    this.c.strokeRect(this.x, this.y, 30, 30)

                }

            })


        })

    }

    update(grid, input){

        if (!input.paused){

            input.grid = grid;
            grid.input = input;
            input.brick = this.brick;

            grid.refresh()

            input.moveHandle(this.brick, grid)

            this.brick.lockIn(grid)


        }

    }

    render(grid){

        this.brick.iterate(grid, 'draw', 1)

        grid.draw()

        grid.background()
        
    }


}

/*


TETRIS FEATURES
-Bricks spawn semi-randomly (array), (some sort of brick manager or utililty function)
-Bricks fall (fast and slow) (Brick?)
-Bricks rotate (Input & Bricks)
-Bricks lock in place after short time (Input & Grid)
-Full row is cleared (Grid)
-Hold a piece with 'c' (Input)
-Scoring (Game)
-Bricks cannot be placed onto locked in bricks (Grid)
-Bricks will automatically lock in if rotate is spammed (Input & Brick)
-Bricks will move upwards to fit if rotated (within ~4 lines, otherwise prevent rotation alltogether) (Brick & Grid)
-Pause menu (Game)
-Sounds (Audio?)
-Music (Audio?)
-Game speeds up over time (Game)
-Track lines deleted (Game)


INPUTS:
-Hard drop
-Slow drop
-Rotate
-Hold
-Pause

SCORING:
-Points based on lines cleared
-Track total lines cleared

GAME:
-Speed up over time
-Pause menu
*/