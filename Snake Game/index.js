const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;                                                          

//Get high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

//Passing a random number between 1 to 30 as food position in X and Y direction

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

//Changing speed upon size increasing

const changeDirection = e => {
    if(e.key ==="ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }

    else if(e.key ==="ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }

    else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }

    else if(e.key=== "ArrowRight" && velocityX != -1 ){
        velocityX = 1;
        velocityY = 0;
    }
}

//Changing direction of each ley click

controls.forEach(button => button.addEventListener("click", () => changeDirection({key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html =`<div class= "food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //When Snake eats the food
    if(snakeX ===foodX && snakeY ===foodY){
        updateFoodPosition();
        snakeBody.push([foodY , foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;

        localStorage.setItem('high-score',highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    //Update Snake Head Speed
    snakeX += velocityX;
    snakeY += velocityY;

    //Shifting forward values of elements in snake body by one
    for(let i = snakeBody.length -1;i>0;i--){
        snakeBody[i]= snakeBody[i-1];
    }

    snakeBody[0] = [snakeX,snakeY];

    //Checking is snake hits the wall
    if(snakeX <= 0 || snakeX > 30 || snakeY <=0 || snakeY > 30){
        return gameOver = true;
    }

    //Adding div for each part of snake body as it eats the food
    for(let i = 0;i<snakeBody.length;i++){
        html += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}" ></div>`;
        //Check Snake head hit the body of snake
        if( i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup",changeDirection);