const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations")
const ghostFrames = document.getElementById("ghosts");

let createRect = (x,y,width,height,color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height);
};
let fps = 30;
let oneBlockSize = 20;
let wallColor =  "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897"
let score = 0;
let ghosts = [];
let  ghostCount = 4;
let lives = 3;
let foodCount = 0;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

//ghost locations
let ghostLocation = [
    {x:0,y:0},
    {x:176,y:0},
    {x:0,y:121},
    {x:176,y:121},
]

//21 columns 
//23 rows
// if 1 wall, if 0 not wall
// 2 is for food

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
for(let i= 0;i<map.length;i++){
    for(let j = 0;j<map[0].length;j++){
        if(map[i][j]== 2){
            foodCount++;
        }
    }
}

let randomTargetForGhosts = [
    {x:1 * oneBlockSize,y: 1 * oneBlockSize},
    {x:1 * oneBlockSize,y: (map.length - 2) * oneBlockSize},
    {x:(map[0].length-2)* oneBlockSize,y:oneBlockSize},
    {
        x:(map[0].length - 2) * oneBlockSize,
        y:(map.length - 2) * oneBlockSize,
    },
]

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let createGhosts = () =>{
    ghosts = [];
    for(let i = 0;i<ghostCount;i++){
        let newGhost = new Ghost(
            9*oneBlockSize + (i%2 == 0 ? 0 : 1),
            10*oneBlockSize + (i%2 == 0 ? 0 : 1),
            oneBlockSize,
            oneBlockSize,
            pacman.speed/2,
            ghostLocation[i%4].x,
            ghostLocation[i%4].y,
            126,
            116,
            6 + i 
        );
        ghosts.push(newGhost);
    }
}



let gameLoop = () => {
    draw();
    update();
    
};

let update = () =>{
    pacman.moveProcess();
    pacman.eat();
    for(let i = 0;i<ghosts.length;i++){
        ghosts[i].moveProcess();
    }
    if(pacman.checkGhostCollision()){
        
        restartGame();
    }
    if(score >= foodCount){
        drawWin();
        clearInterval(gameInterval);
    }

}

let restartGame = ()=> {
    createNewPacman();
    createGhosts();
    lives-- ;
    if (lives == 0){
        gameOver();
    }
}

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
    
}

let drawGameOver = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!",150,200);
}

let drawWin = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Winner!",165,240);
}

let drawLives = () =>{
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives:", 200 , oneBlockSize*(map.length + 1)+10);
    for(let i = 0;i <lives;i++){
        canvasContext.drawImage(
            pacmanFrames,
            2*oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350+ i * oneBlockSize,
            oneBlockSize*map.length+10,
            oneBlockSize,
            oneBlockSize
        )
    }
}

let drawFoods = () => {
    for(let i = 0;i<map.length;i++) {
        for(let j =0;j<map[0].length;j++){
            if(map[i][j] == 2){
                createRect(
                    j*oneBlockSize+oneBlockSize/3,
                    i*oneBlockSize+oneBlockSize/3,
                    oneBlockSize/3,
                    oneBlockSize/3,
                    foodColor
                )
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score:" + score,
        0,
        oneBlockSize*(map.length+1) + 10
    );
};

let drawGhosts = () => {
    for(let i = 0;i<ghosts.length;i++){
        ghosts[i].draw();
    }
}

let draw = () => {
    createRect(0,0,canvas.width,canvas.height,"black")
    drawWalls();
    drawFoods();
    pacman.draw();

    drawScore();
    drawGhosts();
    drawLives();
}


let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for(let i =0;i <map.length;i++){
        for(let j = 0;j<map[0].length; j++){
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }   
                
            }
        }
    }
};



createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if(k == 37 || k == 65){ // left
            pacman.nextDirection = DIRECTION_LEFT;
        } else if(k == 38 || k == 87){ // up
            pacman.nextDirection = DIRECTION_UP;
        } else if(k == 39 || k == 68){ // right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if(k == 40 || k == 83){ // down
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    },1);
});