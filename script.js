const box = document.getElementById('box');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const instruction = document.getElementById('instruction');
const gameArea = document.getElementById('game-area');
const backsound = document.getElementById('backsound');
const jumpscareSound = document.getElementById('jumpscare-sound');
const jumpscareImage = document.getElementById('jumpscare-image');
const winMessage = document.getElementById('win-message');

let score = 0;
let timeLeft = 60;
let timerId;
let gameStarted = false;
let gameEnded = false;

function getRandomPosition() {
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;

    const x = Math.floor(Math.random() * (gameAreaWidth - boxWidth));
    const y = Math.floor(Math.random() * (gameAreaHeight - boxHeight));

    return { x, y };
}

function moveBox() {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
        instruction.classList.add('hidden');
        backsound.play();
    }
    const { x, y } = getRandomPosition();
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;

    updateBackgroundColor();
}

function placeBoxInCenter() {
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;

    const centerX = (gameAreaWidth - boxWidth) / 2;
    const centerY = (gameAreaHeight - boxHeight) / 2;

    box.style.left = `${centerX}px`;
    box.style.top = `${centerY}px`;
}

function updateTimer() {
    timeLeft -= 1;
    timerDisplay.textContent = `Waktu: ${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(timerId);
        if (score < 50) {
            triggerJumpscare();
        }
    }
}

function incrementScore() {
    score += 1;
    scoreDisplay.innerHTML = `
        <img src="gambar.png" alt="Score Box">
        ${score}
    `;
    if (score >= 50) {
        winGame();
    }
}

function startGame() {
    timerId = setInterval(updateTimer, 1000);
}

function triggerJumpscare() {
    if (!gameEnded) {
        gameEnded = true;
        backsound.pause();
        jumpscareSound.play();
        setTimeout(() => {
            jumpscareImage.classList.remove('hidden');
        }, 900);
    }
}

function updateBackgroundColor() {
    const maxClicks = 20;
    const colorStep = 255 / maxClicks;
    const currentColor = Math.max(0, 255 - score * colorStep);
    document.body.style.backgroundColor = `rgb(${currentColor}, ${currentColor}, ${currentColor})`;
}

function winGame() {
    gameEnded = true;
    clearInterval(timerId);
    backsound.pause();
    winMessage.classList.remove('hidden');
}

box.addEventListener('click', () => {
    incrementScore();
    moveBox();
});

gameArea.addEventListener('click', (e) => {
    if (e.target !== box && gameStarted) {
        triggerJumpscare();
    }
});

placeBoxInCenter();
