const playBoard = document.getElementById("play-board");
let ScoreElement = document.getElementById("score");
const HighScoreElement = document.getElementById("high-score");
let contrl = document.querySelector(".controls")
const controls = document.querySelectorAll(".controls i");
let head = document.getElementById("Head");

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let score = 0;
// Getting high score from the local storage
let highScore = localStorage.getItem("High-Score") || 0;
HighScoreElement.innerText = `High Score: ${highScore}`

let foodX, foodY;
let snackX = 10, snackY = 20
let velocityX = 0, velocityY = 0;
let snackbody = [];
let setIntervalId;
let gameOver = false;
let htmlmarkup

const updateFoodPosition = () => {
    // Passing a random 1 - 39 value as food position
    foodX = Math.floor(Math.random() * (29 - 10 + 1) + 10);
    foodY = Math.floor(Math.random() * (29 - 10 + 1) + 10)
    console.log(foodX, foodY, "random");
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach((key) => {
    key.addEventListener("click", () => {
        changeDirection({ key: key.dataset.key })
    })
});

const changeDirection = (e) => {
    // Changing velocity value based on key press
    // moveSound.play();
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        // console.log(velocityX, velocityY, "Arrowp");
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        contrl.classList.remove("top")
        // console.log(velocityX, velocityY, "ArroDown");
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        // console.log(velocityX, velocityY, "ArrowLeft");
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        // console.log(velocityX, velocityY, "ArrowRight");
    }

    initGame()

}

function handleGameOver() {
    musicSound.pause();
    gameOverSound.play();
    alert("Game Over! Press OK to replay...");
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    location.reload();

}

const initGame = () => {

    if (gameOver === true) {
        return handleGameOver();
    }
    musicSound.play();
    htmlmarkup = `<div class ="food" style="grid-area:${foodY} / ${foodX}"></div>`;

    // Updating the snake's head position based on the current velocity
    snackX += velocityX;
    snackY += velocityY;
    // console.log(snackY, snackX, "changeDirection");
    htmlmarkup += `<div class ="head " style="grid-area:${snackY} / ${snackX}"></div>`;

    // Checking if the snake hit the food
    if (snackX === foodX && snackY === foodY) {
        console.log("updatefoodposition");
        updateFoodPosition();
        foodSound.play();
        snackbody.push([foodX, foodY]); // Pushing food position to snake body array
        // console.log(snackbody, "Arrays");
        score++
        highScore = score >= highScore ? score : highScore;
        console.log(highScore,"high");
        localStorage.setItem("High-Score", highScore);
        ScoreElement.innerText = `Score: ${score}`;
        HighScoreElement.innerText = `High Score: ${highScore}`
    }

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snackbody.length -1 ; i > 0; i--) {
        snackbody[i] = snackbody[i - 1];
        // console.log(snackbody[i],"pp");
        // console.log(playBoard);
    }

    snackbody[0] = [snackX, snackY];
    // console.log(snackbody[0], "snackbody");

    for (let i = 1; i < snackbody.length; i++) {
        // Adding a div for each part of the snake's body
        htmlmarkup += `<div class ="tails flex" style="grid-area:${snackbody[i][1]} / ${snackbody[i][0]}"><div class ="dot"></div></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snackbody[0][1] === snackbody[i][1] && snackbody[0][0] === snackbody[i][0]) {
            gameOver = true;
            console.log(snackbody[0][1], snackbody[i][1], snackbody[0][0], snackbody[i][0], "snackbody");
        }
    }


    if (snackX <= 1 || snackX >= 30 || snackY <= 1 || snackY >= 30) {
        gameOver = true;
    }
    playBoard.innerHTML = htmlmarkup;

}

updateFoodPosition();
// initGame();

setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection)
