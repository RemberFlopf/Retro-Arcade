export default class Input{

    constructor(game){

        this.input = this.input.bind(this)
        this.inputUp = this.inputUp.bind(this)

        document.addEventListener('keydown', this.input)
        document.addEventListener('keyup', this.inputUp)

        this.controls = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", 'p']

        this.inputOrder = [];

        this.grid = 0;

        this.holdPiece = 0;

        this.swap = true;

        this.inputs = new Set()

        this.hold = false;
        this.downCheck = false;

        this.game = game;
        this.brick = 0;

        this.paused = false;

        this.update = 0;
        this.updateX = 0;

        this.noDiagonal = false;

        this.downPressed = false;
        this.upPressed = false;

        this.dropSpeed = 60;
        this.currentSpeed = 60;

        this.logicalWidth = game.logicalWidth;

        this.halfway;
        this.wallKick = 0;
        this.floorKick = 0;

        this.sideCheck = 0;

    }


    input(e){

        if (!this.paused){

            if (e.key === this.controls[0] || e.key === this.controls[1]){

                this.inputOrder.unshift(e.key)
    
            }
    
            this.inputs = new Set(this.inputOrder)
    
            if (e.key === this.controls[2] && !this.downPressed){
    
                this.downPressed = true;
    
                this.currentSpeed = this.dropSpeed;
    
                this.dropSpeed = 2;
    
            }

            else if (e.key === this.controls[3] && !this.upPressed ){

                this.upPressed = true;
    
                this.wallKick = this.brick.position.x;
                this.floorKick = this.brick.position.y;

                this.downCheck = 1;
    
                this.brick.type.data = this.brick.rotateMatrix(this.brick.type.data)
    
                while(this.brick.iterate(this.grid, 'collision', 0)){
    
                    switch(this.sideCheck){
    
                        case 0:
                            this.brick.position.x = this.wallKick + 1;
                            break;
    
                        case 1:
                            this.brick.position.x = this.wallKick - 1;
                            break;
    
                        case 2:
                            this.brick.position.x = this.wallKick;
                            break;
    
                    }
    
                    this.sideCheck += 1;
    
                    if (this.brick.position.x === this.wallKick){
    
                        this.brick.position.y += this.downCheck;
                        this.sideCheck = 0;
    
                    }
    
                    if (this.brick.position.y - this.brick.type.data.length > this.floorKick){

                        this.brick.position.y = this.floorKick;
                        this.downCheck = -1;
    
                    }

                    else if (this.brick.position.y + this.brick.type.data.length < this.floorKick){

                        break;

                    }
                }
    
                while(this.brick.iterate(this.grid, 'wall')){
    
                    this.halfway = (this.grid.matrix[0].length -1)/2;
    
                    if (this.brick.position.x < this.halfway){
    
                        this.brick.position.x += 1;
    
                    }
    
                    else if (this.brick.position.x > this.halfway){
                        this.brick.position.x -= 1;
                    }
    
                }
    
                this.checkValidPos()
            }
    
            else if (e.key === this.controls[4]){

                if (!Number.isNaN(this.brick.iterate(this.grid, 'ghost') - 1)){

                    this.game.score += (this.brick.iterate(this.grid, 'ghost') - 1) * 2

                    this.brick.position.y += this.brick.iterate(this.grid, 'ghost') - 1

                    this.brick.succeed(this.grid)   
    

                }
            }
        }

        if (e.key === this.controls[5]){

            if (this.paused){

                this.paused = false;
            }

            else{

                this.paused = true;

            }

        }

        if (e.key === 't'){

            console.table(this.grid.matrix)

        }

        if (e.key === 's'){

            console.table(this.grid.saveData)

        }

        if (e.key === 'c' && !this.paused && this.swap){

            

            if (this.holdPiece != 0){

                this.swap = false;

                [this.game.brick, this.holdPiece] = [this.holdPiece, this.game.brick]

            }

            else{

                this.holdPiece = this.game.brick;
                this.hold = true;

            }

        }

    }

    checkValidPos(){

        if (this.brick.iterate(this.grid, 'positions', 0)){

            for (let i = 0; i < 3; i++){

                this.brick.type.data = this.brick.rotateMatrix(this.brick.type.data);

            }

            this.brick.position.x = this.wallKick;
            this.brick.position.y = this.floorKick;

        }

    }

    
   inputUp(e){

        this.inputs.delete(e.key)

        this.inputOrder = Array.from(this.inputs)

        if (e.key === this.controls[2]){

            this.downPressed = false;

            this.dropSpeed = this.currentSpeed;

        }

        if (e.key === this.controls[3]){

            this.upPressed = false;

        }

    }


    check(xDirection, grid, brick, pos){

            if (brick.iterate(grid, 'positions', xDirection)){

                return false;

            }

            return true;
    }

    moveHandle(brick, grid){

        this.update++

        this.updateX++

        if (this.updateX > 5){

            this.noDiagonal = true;

            this.updateX = 0;

            if (this.inputOrder[0] === this.controls[0] && !brick.iterate(grid, 'wall', -1) && this.check(-1, grid, brick)){
            
                brick.dx = -1;

            }
        
            else if (this.inputOrder[0] === this.controls[1] && !brick.iterate(grid, 'wall', 1) && this.check(1, grid, brick)){

                brick.dx = 1;

            }

        }
    
        else{

            this.noDiagonal = false;

            brick.dx = 0;
        }

        if (this.update > this.dropSpeed && !brick.stop && !this.noDiagonal){

            this.update = 0;

            brick.dy = 1;

            if (this.downPressed){

                this.game.score += 1;

            }

        }

        else{
            brick.dy = 0;
        }

        brick.move()
    

    }

}