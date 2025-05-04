export default class Grid{

    constructor(game, rows, columns, brick){

        this.rows = rows;
        this.columns = columns;

        this.matrix = [];
        this.saveData = null;
        this.data = [];

        this.game = game;

        this.input = 0;

        this.rowClear = 0;
        this.rowsCleared = 0;
        this.levelUpTracker = 0;
        this.totalLinesCleared = 0;

        this.ctx = game.ctx;

        this.points = 0;

    }

    refresh(){

        this.matrix = [];

        for (let r = 0; r < this.rows; r++){

            for (let d = 0; d < this.columns; d ++){

                this.data.push(this.saveData?.[r]?.[d] ?? {state: 0, colour: undefined, x: d * 30, y : r * 30})

            }

            this.matrix.push([...this.data])
            this.data.length = 0;

        }
    }

    background(){

        this.ctx.strokeStyle = 'gray';

        this.ctx.globalAlpha = 0.2;

        for (let r = 0; r < this.rows; r++){

            for (let d = 0; d < this.columns; d++){

                this.ctx.strokeRect(d * this.game.logicalWidth/10, r * this.game.logicalHeight/20, 30, 30)

            }

        }

        this.ctx.globalAlpha = 1;

    }
    
    save(){

        this.saveData = [...this.matrix];

        this.loop()

    }

    draw(){

        this.matrix.forEach((row, rowIndex) =>{

            row.forEach((square, squareIndex) => {

                if (square.state != 0){


                    this.ctx.globalAlpha = 1;

                    this.ctx.fillStyle = square.colour;

                    this.ctx.fillRect(squareIndex * 30, rowIndex * 30 , 30, 30)
                    this.ctx.strokeRect(squareIndex * 30, rowIndex * 30, 30, 30)


                }


            })

        })
    }

    loop(){

        this.rowsCleared = 0;

        for (let [rowIndex, row] of this.saveData.entries()){

            this.rowClear = 0;

            for (let [squareIndex, d] of row.entries()){

                if (d.state === 2){

                    this.rowClear += 1;

                    if (this.rowClear === row.length){

                        this.totalLinesCleared += 1;

                        this.rowsCleared += 1;

                        this.rowClear = 0;

                        this.levelUp()

                        for (let i = rowIndex; i > 0; i--){

                            this.saveData[i] = this.saveData[i - 1]

                        }

                    }


                }

                else if (d.state === 1){

                    d.state = 0;
                    d.colour = undefined;

                }

            }

        }

        switch(this.rowsCleared){

            case 1:
                this.game.score += 100 * this.game.level;
                break;

            case 2:
                this.game.score += 300 * this.game.level;
                break;

            case 3:
                this.game.score += 500 * this.game.level;
                break;

            case 4:
                this.game.score += 800 * this.game.level;
                break;


        }

    }

    levelUp(){

        if (this.levelUpTracker >= 10){

            this.levelUpTracker = 0;

            this.game.level += 1;

        }

    }

    addBrick(startRow, startColumn, add, colour, x, y){

        this.matrix[startRow][startColumn]= {state : add, colour : colour, x : x, y : y}       
    }
}