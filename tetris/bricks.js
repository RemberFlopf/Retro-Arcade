export default class Bricks{

    constructor(game, width, height, type){

        this.width = width;
        this.height = height;

        this.x = 0;
        this.y = 0;

        this.collisionX = 0;
        this.collisionY = 0;

        this.canvasHeight = game.logicalHeight;
        this.canvasWidth = game.logicalWidth;

        this.ctx = game.ctx;

        this.dy = 1;
        this.dx = 0;

        this.rotationState = 0;

        this.stop = false;

        this.lockDelay = 0;
        this.cancel = 0;

        this.cancellations = 0;

        this.square =  {x : this.x, y : 1000}

        this.types = {

            "I": {

                data: [

                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0]

                ],

                colour: "cyan",
                opacity : 0.2
            
            },

            "J": {

                data: [

                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]

                ],

                colour: "blue",
                opacity : 0.2
            },


            "L": {

                data: [

                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]

                ],

                colour: "orange",
                opacity : 0.2
            },

            "O": {

                data: [

                    [1, 1],
                    [1, 1]

                ],

                colour: "yellow",
                opacity : 0.2
            },

            "S": {

                data: [

                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]

                ],

                colour: "green",
                opacity : 0.3
            },

            "T": {

                data: [

                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]

                ],

                colour: "purple",
                opacity : 0.4
            },

            "Z": {

                data: [

                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]

                ],

                colour: "red",
                opacity : 0.2
            },

        }

        this.state = 1;

        this.shadow = true;

        this.type = this.types[type];

        this.position = {x: 3, y: 0};

        if (this.type.data[0].length < 3){

            this.position.x += 1;

        }
    }

    rotateMatrix(matrix) {

        const n = matrix.length;
        const rotated = Array(matrix[0].length).fill(null).map(() => Array(n)); // Create a new matrix
      
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < matrix[0].length ; j++) {

            rotated[j][n - 1 - i] = matrix[i][j];

          }
        }

        return rotated;
      }

    iterate(grid, action, direction, value){

        this.ctx.fillStyle = this.type.colour;
        this.ctx.strokeStyle = 'black'

        for (let [rowIndex, row] of this.type.data.entries()){

            //rowIndex = current row index
            //row = current row
            //all = whole array 

            for (let [squareIndex, d] of row.entries()){

                //What we are doing - for each row, take every bit of data and draw some squares idkhhow this even works

                if (d === 1){

                    this.collisionX = this.width * (squareIndex + this.position.x);

                    this.collisionY = this.height * (rowIndex + this.position.y);   
                    
                    if (action === 'draw'){

                        this.x = this.width * (squareIndex + this.position.x);

                        this.y = this.height * (rowIndex + this.position.y);

                        grid.addBrick(this.y/30, this.x/30, this.state, this.type.colour, this.x, this.y)

                        this.ctx.globalAlpha = this.type.opacity;

                        this.ctx.fillRect(this.x, this.y + (this.iterate(grid, 'ghost') - 1) * 30, this.width, this.height)
                        this.ctx.strokeRect(this.x, this.y + (this.iterate(grid, 'ghost') - 1) * 30, this.width, this.height)

                        
                    }

                    else if (action === 'collision'){

                        if (grid.matrix?.[this.collisionY/30 + direction]?.[this.collisionX/30]?.state === 2 || this.collisionY + this.height > this.canvasHeight - direction){

                            return true;
                        }

                    }

                    else if (action === 'ghost'){

                        for (let i = 0; i < grid.matrix.length; i ++){

                        if (this.collisionY + (i * 30) > this.canvasHeight){

                            return grid.matrix.length - this.collisionY/30;

                            console.log("Wall: ", grid.matrix.length - this.collisionY/30)

                        }


                        if (this.iterate(grid, 'collision', i)){

                                return i;

                                console.log("Collision:", i)

                                //How far away our LOWEST block is

                                //lOWEST - HIGHEST = 

                                //Returns when our last block + i collidies wth somehign

            

                            }

                        }

                    }

                    else if (action === 'wall'){

                        if (this.collisionX + this.width > this.canvasWidth || (direction === 1 && this.collisionX + this.width >= this.canvasWidth)){

                            return true;

                        }

                        else if (this.collisionX < 0 || (direction === -1 && this.collisionX <= 0)){

                            return true;

                        }

                    }

                    else if (action === 'positions'){

                        if (grid.matrix[this.collisionY/30][this.collisionX/30 + direction].state === 2){

                            return true;

                        }

                    }

                    else if (action === 'delete'){

                        if (this.collisionY/30 === direction){

                            if (this.type.data?.[rowIndex - 1]?.[squareIndex] ?? 0 === 1){

                                this.type.data[rowIndex][squareIndex] = this.type.data[rowIndex - 1][squareIndex];
                                this.type.data[rowIndex - 1][squareIndex] = 0;

                            } 

                            else{
                                this.type.data[rowIndex][squareIndex] = 0;

                            }

                        }

                    }

                }

            }

        }

    }

    move(){

        this.position.x += this.dx;
        this.position.y += this.dy;
    }

    lockIn(grid){

        if (this.iterate(grid, 'collision', 1)){

            if (!this.stop){

                this.stop = true;

                this.lockDelay = setTimeout(() => {

                    this.cancel = setInterval(() => {

                        if ((this.iterate(grid, 'collision', 1))){

                            this.succeed(grid)
    
                        }

                    }, 100)

                 
                }, 1000 - this.cancellations*100)

            }

        }

        if (this.stop){
            
            if (!this.iterate(grid, 'collision', 1)){

                this.cancellations += 1;

                this.stop = false;
                clearTimeout(this.lockDelay)

            }

        }

    }

    succeed(grid){

        clearInterval(this.cancel)

        this.cancellations = 0;

        this.state = 2;
        this.iterate(grid, 'draw')

        grid.save()  

    }

}