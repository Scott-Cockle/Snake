let lives = 3;
let score = 0;

const updateLives = () => {
    document.querySelector('.lives').textContent = lives;
}

const decreaseLives = () => {
    lives--;
    updateLives();

    if (lives === 0) {
        gameOver();
    } else {
        resetSnake();
    }
}

const resetLives = () => {
    lives = 3;
    updateLives();
    score = 0;
    document.querySelector('.score').textContent = score;
}

const gameOver = () => {
    document.querySelector('h1').innerText = 'Game Over';
    clearInterval(moveInterval);
}

const resetGame = () => {
    clearInterval(moveInterval);
    resetSnake();
    placeAppleAt(...getRandomPosition());
    document.querySelector('h1').innerText = 'Score: 0 | Lives: ' + lives;
    document.querySelectorAll('input').forEach(input => {
        input.disabled = false;
        input.checked = false;
        input.classList.remove('apple');
    });
    startGame();
}

const startGame = () => {
    handleInput();
    updateLives();
    resetLives();
    checkItemAt(...startPoint);
    placeAppleAt(...getRandomPosition());
}

startGame();