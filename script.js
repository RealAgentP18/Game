// Getting the HTML elements
const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const gridSize = 20; // Each square size (20px)
const boardSize = 20; // Number of squares per row/column (20x20 grid)
let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 }; // Initially moving right
let food = { x: 10, y: 10 };
let score = 0;
let gameInterval;
let newDirection = { x: 1, y: 0 }; // Store the new direction separately to avoid conflicts during the game loop

// Initialize the game
function drawBoard() {
    board.innerHTML = ''; // Clear the board

    // Draw the snake
    snake.forEach((segment) => {
        const snakeSegment = document.createElement('div');
        snakeSegment.style.left = `${segment.x * gridSize}px`;
        snakeSegment.style.top = `${segment.y * gridSize}px`;
        snakeSegment.classList.add('snake');
        board.appendChild(snakeSegment);
    });

    // Draw the food
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * gridSize}px`;
    foodElement.style.top = `${food.y * gridSize}px`;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Update the score
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game loop
function gameLoop() {
    // Update direction to newDirection (prevents issues if multiple keys are pressed)
    direction = { ...newDirection };

    // Calculate new head position
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Collision detection with walls
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize) {
        resetGame();
        return;
    }

    // Collision detection with snake itself
    if (snake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        resetGame();
        return;
    }

    // Add new head to the snake
    snake.unshift(newHead);

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        spawnFood(); // Create a new food
    } else {
        snake.pop(); // Remove the tail if no food was eaten
    }

    drawBoard();
}

// Spawn food at a random position
function spawnFood() {
    food.x = Math.floor(Math.random() * boardSize);
    food.y = Math.floor(Math.random() * boardSize);
}

// Event listener for direction control
document.addEventListener('keydown', (event) => {
    // Allow immediate direction change (without blocking reverse directions)
    if (event.key === "ArrowUp") {
        newDirection = { x: 0, y: -1 }; // Move up
    } else if (event.key === "ArrowDown") {
        newDirection = { x: 0, y: 1 }; // Move down
    } else if (event.key === "ArrowLeft") {
        newDirection = { x: -1, y: 0 }; // Move left
    } else if (event.key === "ArrowRight") {
        newDirection = { x: 1, y: 0 }; // Move right
    }
});

// Reset the game if snake collides with itself or the walls
function resetGame() {
    snake = [{ x: 5, y: 5 }];
    direction = { x: 1, y: 0 };
    score = 0;
    spawnFood();
}

// Start the game
spawnFood();

// Adjust the game speed here (200ms is a good starting point)
gameInterval = setInterval(gameLoop, 100); // Slow down the speed to 100ms
