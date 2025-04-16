console.clear()

let multiPlayer;
let choice;
let players = document.getElementsByClassName('player');
let buttons = document.getElementsByClassName('difficulty')

function multiplayer(bot){

    choice = document.getElementById("difficulty")

        choice.style.display = "unset"
    
    for (let i = 0; i < players.length; i ++){
        players[i].style.display = "none";
    }


    if (bot === 0){

        choice.textContent = "Choose a difficulty:"

        for (let i = 0; i < buttons.length; i ++){
            buttons[i].style.display = "unset";
        }
    
        multiPlayer = false;
    }

    else{
        multiPlayer = true;

        gameStart(0)

    }

    console.log(multiPlayer)
} 

function gameStart(difficulty){

    let choice = document.getElementById("difficulty");

    choice = document.getElementById("difficulty")
    
    choice.style.display = "none";

    for (let i = 0; i < buttons.length; i ++){
        buttons[i].style.display = "none";
    }

    canvas = document.getElementById("Pong");
    let ctx = canvas.getContext("2d");

    canvas.style.display = "flex";

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    let x = 20;
    let y = 240;

    let Ex = 1170;
    let Ey = 240;

    let Em = Ey - 50;

    let changeX = Math.random() < 0.5 ? -2 : 2;
    let changeY = Math.random();

    let ballX = 600 - (changeX * 10);
    let ballY = 240;

    let moveDelay = 0;

    let upPressed = 0;
    let downPressed = 0;

    let speed = 1;

    let playerPoints = document.getElementById("pPoints");
    let enemyPoints = document.getElementById("ePoints");

    let victory = document.getElementById("win");
    let loss = document.getElementById("lose");

    let opponent_move;
    let EupPressed;
    let EdownPressed;

    victory.textContent = "You win!"
    loss.textContent = "You lose."

    
    function randomY(){

        while (changeY < 0.5){
            changeY = Math.random()
        }

        if (Math.random() < 0.5 ? -1 : 1 === -1){
            changeY = -changeY;
        }

        console.log(changeY)

    }

    function drawPlayer(){

        //Draws the player paddle

        //Setup the canvas element and draw a simple rectangle

        ctx.fillRect(x, y, 20, 90);

        //x, y, width, height

        ctx.clearRect(x + 5, y + 15, 10, 60);

        //Delete stuff


    }

    function drawOppenent(){

        ctx.fillRect(Ex, Ey, 20, 90);

        ctx.clearRect(Ex + 5, Ey + 15, 10, 60);

    }

    function moveGood(plusMinus, h){
        
        for (let i = 0; i < 100; i ++){

            setTimeout(() => {

                ctx.clearRect(x, y, 20, 90);
                ctx.clearRect(Ex, Ey, 20, 90);

                if (h === 1){

                    y += plusMinus;

                }

                else{
                    Ey += plusMinus
                }

                window.requestAnimationFrame(drawPlayer)
                window.requestAnimationFrame(drawOppenent)

            }, moveDelay)

            moveDelay += 0.5;

        }
    }

    function moveHandler(){

        if (upPressed === 1  && y > 3){
            moveGood(-0.1, 1)
        }

        else if (downPressed === 1  && y < 480 - 90){
            moveGood(0.1, 1)
        }

        moveDelay = 0;

        if (EupPressed === 1 && Ey > 3){
            moveGood(-0.1, 0)
        }

        else if (EdownPressed === 1 && Ey < 480 - 90){
            moveGood(0.1, 0)
        }

        moveDelay = 0;
    }

    function moveUpPlayer (event){

        //EXTREMELY IMPORTANT --- HOW TO HANDLE INPUT

        if ((event.key === 'ArrowUp' && !multiPlayer) || (event.key === 'w' && multiPlayer)){
            
            upPressed = 1;

        }

        else if ((event.key === 'ArrowDown' && !multiPlayer) || (event.key === 's' && multiPlayer)){

            downPressed = 1;

        }

        if ((event.key === 'ArrowUp' && multiPlayer)){
            
            EupPressed = 1;

        }

        else if ((event.key === 'ArrowDown' && multiPlayer)){

            EdownPressed = 1;

        }

    }

    function moveDownPlayer (event){

        //EXTREMELY IMPORTANT --- HOW TO HANDLE INPUT

        if ((event.key === 'ArrowUp' && !multiPlayer) || (event.key === 'w' && multiPlayer)){

            upPressed = 0;

        }

        else if ((event.key === 'ArrowDown' && !multiPlayer) || (event.key === 's' && multiPlayer)){

            downPressed = 0;

        }

        
        if ((event.key === 'ArrowUp' && multiPlayer)){
            
            EupPressed = 0;

        }

        else if ((event.key === 'ArrowDown' && multiPlayer)){

            EdownPressed = 0;

        }


    }

    function moveOppenent(){

        switch(difficulty){

            case 1:
                moveOppenentGood(0, 25, 1, Ey, 5, 90, 90)
                break;

            case 2:
                moveOppenentGood(0, 20, 1.5, Ey, 7, 80, 80)
                break;

            case 3:
                moveOppenentGood(0, 15, 0.5, Em, 8, 50, 40)
                break;

            case 4:
                moveOppenentGood(0, 10 - speed, speed, Em, 5, 20 + (speed), 10 + (speed))
                break;

        }

    }

    function moveOppenentGood(delay, distance, nyoom, enemy, increase, num1, num2){

        if (distance < 1){
            distance = 1;
        }

        for (let h = 0; h < distance; h ++){

            setTimeout(() =>{

                ctx.clearRect(Ex, Ey, 20, 90);

                if (ballY > enemy + num2  && Ey < 390){

                    Ey += 1 * nyoom;
        
                }
        
                else if (ballY < enemy - num1 && Ey > 3){
        
                    Ey -= 1 * nyoom;
        
                }
        
                window.requestAnimationFrame(drawOppenent)

            }, delay)

            delay += increase;

        }


    }

    function fix_stuff(){

        //Ball trail clearing doesn't clear anything else

        ctx.clearRect(x, 0, 20, 500);

        ctx.clearRect(Ex, 0, 20, 500);

        drawPlayer()

        drawOppenent()

        ctx.beginPath();
        ctx.moveTo(600, 0);
        ctx.lineTo(600, 500);
        ctx.stroke();

        ctx.closePath()

    }

    function ballUpdate(){

        ctx.clearRect(ballX - 5, ballY - 5, 9, 9);

        Em = Ey + 50;

        fix_stuff()

        ballX += changeX;

        ballY += changeY;


        if (ballY >= 480){

            changeY = -speed;

        }

        else if (ballY <= 0){

            changeY = speed;

        }

        if (ballX >= 1200){

            gameWon(playerPoints, -2);
        }

        else if (ballX <= 0){

            gameWon(enemyPoints, 2);

        }

        checkPaddle()

        //x, y, radius, startAngle, endAngle, counterclockwise?

        ctx.beginPath()

        ctx.arc(ballX, ballY, 3, 0, 12, false)

        ctx.fill()

        ctx.closePath()


    }

    function checkPaddle(){

        if (ballX <= 40){

            if (ballY >= y && ballY <= y + 90){

                speed += 0.3;

                changeX = speed * 2

            }

        }


        if (ballX >= 1170){

            if (ballY >= Ey && ballY <= Ey + 90){

                switch(difficulty){

                    case 1:
                        speed += 0.1;
                        break;

                    case 2:
                        speed += 0.15
                        break;

                    case 3:
                        speed += 0.2
                        break;

                    case 4:
                        speed += 0.4;
                        break;

                    default:
                        speed += 0.3;
                        break;


                }

                changeX = -(speed * 2)

            }

        }

    }

    function gameWon(winner, direction){

        speed = 0;
        ballY = 240;
        ballX = 580;

        changeX = 0;
        changeY = 0;

        winner.textContent ++

        playerPoints.style.display = "unset";
        enemyPoints.style.display = "unset";

        setTimeout(() => {

            if (playerPoints.textContent === "7"){

                canvas.style.display = "none";

                if (multiPlayer){

                    victory.textContent = "Player 1 Wins!"

                }

                victory.style.display = "unset";

                
                clearInterval(update_ball)
                clearInterval(opponent_move)
                clearInterval(handle_move)
 
                victory.addEventListener("click", again)
            }

            else if (enemyPoints.textContent === "7"){

                canvas.style.display = "none";

                if (multiPlayer){

                    loss.textContent = "Player 2 Wins!"

                }

                loss.style.display = "unset";

                clearInterval(update_ball)
                clearInterval(opponent_move)
                clearInterval(handle_move)

                loss.addEventListener("click", again)
            }

            speed = 1;
            changeX = direction;
            randomY()

            playerPoints.style.display = "none";
            enemyPoints.style.display = "none";

        }, 1000)

    }

    function again(){

        playerPoints.textContent = "0"
        enemyPoints.textContent = "0"

        loss.style.display = "none";
        victory.style.display = "none";
        
        choice.style.display = "unset";

        for (let i = 0; i < players.length; i ++){
            players[i].style.display = "unset";
        }

        difficulty = 0;
    }

    //Setup the paddles

    drawPlayer()
    drawOppenent()
    randomY()

    //THIS CHECKS FOR KEYS BEING PRESSED

    document.addEventListener("keydown", moveUpPlayer);
    document.addEventListener("keyup", moveDownPlayer);

    //Checking for keyup as well removes key repeat delay

    let update_ball = setInterval(ballUpdate, 10)

    if (!multiPlayer){

        opponent_move = setInterval(moveOppenent, 10)

    }

    else{

    }

    let handle_move = setInterval(moveHandler, 1)


}
