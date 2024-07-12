const rows = document.querySelectorAll('.row');

const getItemAt = (x, y) => rows[y - 1].children[x - 1];
const checkItemAt = (x, y) => {
    const item = getItemAt(x, y);
    item.checked = true;
    item.classList.add('snake-part');
}
const unCheckItemAt = (x, y) => {
    const item = getItemAt(x, y);
    item.checked = false;
    item.classList.remove('snake-part');
}

const placeAppleAt = (x, y) => {
    const item = getItemAt(x, y);
    item.type = 'radio';
    item.classList.add('apple');
    item.classList.remove('snake-part');
    item.checked = true;
}

const removeAppleAt = (x, y) => {
    const item = getItemAt(x, y);
    item.type = 'checkbox';
    item.classList.remove('apple');
    item.checked = false;
}

const getApplePosition = () => {
    let position = [1, 1];

    rows.forEach((row, rowIndex) => {
        Array.from(row.children).forEach((input, inputIndex) => {
            if (input.type === 'radio') {
                position[0] = inputIndex + 1, position[1] = rowIndex + 1;
            }
        });
    });

    return position;
}

const getRandomPosition = () => {
    const availablePositions = [];

    rows.forEach((row, rowIndex) => {
        Array.from(row.children).forEach((input, inputIndex) => {
            if (input.type === 'checkbox' && !input.checked) {
                availablePositions.push([inputIndex + 1, rowIndex + 1]);
            }
        });
    });

    const index = Math.floor(Math.random() * availablePositions.length);

    return availablePositions[index];
}

const increaseScore = () => {
    const score = document.querySelector('.score');

    const currentScore = parseInt(score.innerText, 10);
    score.innerText = currentScore + 1;
}

const resetSnake = () => {
    snake.forEach(part => unCheckItemAt(...part));
    
    snake.length = 1;
    snake[0] = [...startPoint];
    
    checkItemAt(...startPoint);

    clearInterval(moveInterval);
    moveInterval = undefined;

    movingDirection = null;
}

const handleInput = () => {
    document.addEventListener('keydown', e => {
        switch(e.keyCode) {
            case key.arrowUp:
                movingDirection = movingDirection === 'down' ? 'down' : 'up'; break;
            case key.arrowDown:
                movingDirection = movingDirection === 'up' ? 'up' : 'down'; break;
            case key.arrowLeft:
                movingDirection = movingDirection === 'right' ? 'right' : 'left'; break;
            case key.arrowRight:
                movingDirection = movingDirection === 'left' ? 'left' : 'right'; break;
        }

        if (moveInterval === undefined) {
            moveInterval = setInterval(() => {
                move(movingDirection || 'left');
            }, 1000 / speed);
        }
    });
}

const playWave = head => {
    const checkboxes = [];

    for (let x = 1; x <= worldSize; x++) {
        for (let y = 1; y <= worldSize; y++) {
            checkboxes.push(getItemAt(x, y));
        }
    }

    getItemAt(...head).className = 'wave';

    checkboxes.forEach((checkbox, index) => {
        setTimeout(() => {
            checkbox.className = 'wave';
            checkbox.checked = false;
        }, 10 * index);
    });
}

const move = direction => {
    const applePosition = getApplePosition();
    const head = [...snake[0]];
    const tail = [...snake[snake.length - 1]];

    const updateSnake = () => {
        snake.unshift(head);
        snake.pop();

        snake.forEach(snakePart => checkItemAt(...snakePart));
    }

    switch (direction) {
        case 'up':    head[1] = head[1] === 1 ? worldSize : head[1] - 1; break;
        case 'down':  head[1] = head[1] === worldSize ? 1 : head[1] + 1; break;
        case 'left':  head[0] = head[0] === 1 ? worldSize : head[0] - 1; break;
        case 'right': head[0] = head[0] === worldSize ? 1 : head[0] + 1; break;
    }

    if (getItemAt(...head).type === 'checkbox' && getItemAt(...head).checked) {
        decreaseLives();
        if (lives > 0) { 
            resetSnake();
            return;
        }
    }

    if (head[0] === applePosition[0] && head[1] === applePosition[1]) {
        snake.push(tail);
        placeAppleAt(...getRandomPosition());
        removeAppleAt(...applePosition);
        increaseScore();
        updateSnake();
    } else {
        updateSnake();
        unCheckItemAt(...tail);
    }
}

handleInput();
    document.addEventListener('keydown', e => {
        if (moveInterval === undefined) {
            switch(e.keyCode) {
                case key.arrowUp:
                    movingDirection = movingDirection === 'down' ? 'down' : 'up'; break;
                case key.arrowDown:
                    movingDirection = movingDirection === 'up' ? 'up' : 'down'; break;
                case key.arrowLeft:
                    movingDirection = movingDirection === 'right' ? 'right' : 'left'; break;
                case key.arrowRight:
                    movingDirection = movingDirection === 'left' ? 'left' : 'right'; break;
            }
    
            moveInterval = setInterval(() => {
                move(movingDirection || 'left');
            }, 1000 / speed);
        }
    });