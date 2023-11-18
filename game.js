// Course: SENG 513
// Date: November 17, 2023
// Assignment 3
// Name: Harsanjit Bhullar
// UCID: 30006252

// Add Global Variables
let player1Snake, player2Snake;
let player1Direction = null, player2Direction = null;
let gameInterval
let isGamePaused = false;
let gameStarted = false;
// Fix event queuing issue (pressing multiple keys quickly)
let canUpdatePlayer1Direction = true;
let canUpdatePlayer2Direction = true;
let soundEffectsEnabled = true;

// Intro Screen: Event Listener will run once the elements are all loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const playGameButton = document.querySelector('.play-game-button');
    const introScreen = document.querySelector('.intro-screen');
    const gameContainer = document.querySelector('.game-container');

    playGameButton.addEventListener('click', function() {
        document.getElementById('backgroundMusic').play(); // Play background music
        introScreen.style.display = 'none'; // Hide introduction screen
        gameContainer.style.display = 'flex'; // Show the game
        initializeGame(); // Start the game
    });
});

// Initialization Functions
function initializeGame() {
    setupGameGrid();
    placeSnakes();
    displayInitialUI();
    generateFood();
    waitForStart();
}

/* Show and hide menu buttons */
function displayInitialUI() {
    // Hide Pause and Reset buttons initially
    document.querySelector('.pause-button').style.display = 'none';
    document.querySelector('.reset-button').style.display = 'none';

    // Show Start, Toggle Sound, and Toggle Music buttons
    document.querySelector('.start-button').style.display = 'block';
    document.querySelector('.toggle-sound-button').style.display = 'block';
    document.querySelector('.toggle-effects-button').style.display = 'block';
}

// Setup Game Grid - Initialized by ChatGPT (defining initial game grid)
function setupGameGrid() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    const gridSize = 20;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = `cell-${j}-${i}`;
            gameBoard.appendChild(cell);
        }
    }
}

// We were missing a function to place the snakes on the grid
function placeSnakes() {
    // Fixed placements for both snakes on the grid (every time things reset)
    player1Snake = [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }];
    player2Snake = [{ x: 17, y: 17 }, { x: 16, y: 17 }, { x: 15, y: 17 }];
    // Call function to update snakes on the grid.
    updateSnakeOnGrid(player1Snake, 'player1');
    updateSnakeOnGrid(player2Snake, 'player2');
}

// Hide associated buttons and start the game
function startGame() {
    // Hide Start button
    document.querySelector('.start-button').style.display = 'none';
    document.querySelector('.toggle-sound-button').style.display = 'none';
    document.querySelector('.toggle-effects-button').style.display = 'none';

    // Show Pause and Reset buttons
    document.querySelector('.pause-button').style.display = 'block';
    document.querySelector('.reset-button').style.display = 'block';
    

    clearInterval(gameInterval); // Clear any existing intervals
    resetGame(); // Reset scores at the start
    gameStarted = false; // Reset the gameStarted flag
    player1Direction = null; // Ensure directions are null at start
    player2Direction = null;
}

// Moved initial decision to clear game grid to separate function. 
function resetGame() {
    // Stop the current gameloop (setInterval would execute at the )
    clearInterval(gameInterval);
    gameStarted = false; // Reset the gameStarted flag
    player1Direction = null; // Ensure directions are null at start
    player2Direction = null;

    clearGameGrid();
    initializeGame();

    updateScore('player1', 0, true); // Reset scores for both players
    updateScore('player2', 0, true);

    // Update UI elements
    document.querySelector('.start-button').style.display = 'block';
    document.querySelector('.pause-button').style.display = 'none';
    document.querySelector('.reset-button').style.display = 'none';
}

/* gameLoop iterates and updates the game while checking for collisions and food. 
It will then update the player direction flag to prevent issues with direction. */
function gameLoop() {
    if (!isGamePaused) {
        moveSnake(player1Snake, player1Direction, 'player1');
        moveSnake(player2Snake, player2Direction, 'player2');
        checkForCollisions();
        checkForFood();
    }
    // Reset the update flags
    canUpdatePlayer1Direction = true;
    canUpdatePlayer2Direction = true;
}


/* There was an issue with food collision so ChatGPT was used to 
help fix this issue and define the proper way to complete this function.*/

// This function checks if either snake has collided with food
function checkForFood() {
    // Check if player 1's snake has collided with food
    checkFoodCollision(player1Snake, 'player1');
    // Check if player 2's snake has collided with food
    checkFoodCollision(player2Snake, 'player2');
}

// This function checks if a specific snake has collided with food
function checkFoodCollision(snake, player) {
    // Get the first segment of the snake, which is its head
    var head = snake[0];
    // Find the food cell in the game
    var foodCell = document.querySelector('.food');

    // Split the food cell's id to get its x and y coordinates
    var foodCellCoordinates = foodCell.id.split('-');
    var foodCellX = parseInt(foodCellCoordinates[1]);
    var foodCellY = parseInt(foodCellCoordinates[2]);

    // Check if the snake's head is in the same position as the food
    if (foodCell && head.x === foodCellX && head.y === foodCellY) {
        // If the snake has collided with food, handle the eating process
        eatFood(snake, player);
    }
}

// Clear game grid function 
function clearGameGrid() {
    // Go through each cell
    document.querySelectorAll('.grid-cell').forEach(cell => {
        // Clear the class of each cell in the grid.
        cell.className = 'grid-cell';
    });
}

// Player Movement Functions (Removed separate functions for each player)
function moveSnake(snake, direction, player) {
    // Checked and adjusted based on ChatGPT suggestion
    if (direction === null) return; // Do nothing if direction is null
    let head = { ...snake[0] };

    // Calculate new head position based on the direction
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Prevent immediate self-collision
    if (snake.length > 1) {
        let nextSegment = snake[1];
        if (head.x === nextSegment.x && head.y === nextSegment.y) {
            return; // Do not move if next segment is in the new head position
        }
    }

    // Check for out of bounds or collision with the other snake
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || isCellOccupied(head.x, head.y, player)) {
        endGame(player === 'player1' ? 'Player 2' : 'Player 1');
        return;
    }

    // Add new head to the snake
    snake.unshift(head);
    snake.pop();
    

    // Update the snake on the grid
    updateSnakeOnGrid(snake, player);
}

// Collision Detection
function checkCollision(snake) {
    // The first segment of the snake is its head.
    let head = snake[0];

    // Go through each segment of the snake, starting from the second segment.
    for (let i = 1; i < snake.length; i++) {
        // Get the current segment we're checking.
        let segment = snake[i];

        // Check if the head's position is the same as this segment's position.
        if (segment.x === head.x && segment.y === head.y) {
            // If they are the same, it means the head has collided with this segment.
            // This indicates a collision, so return true.
            return true;
        }
    }

    // If we checked all segments and found no collision, return false.
    return false;
}

// Checks to see if the corresponding snake is in the cell.
function isCellOccupied(x, y, excludingSnake) {
    // Decide which snake to check based on the excludingSnake parameter
    var snakeToCheck;
    if (excludingSnake === 'player1') {
        // If we're excluding player 1's snake, check player 2's snake
        snakeToCheck = player2Snake;
    } else {
        // Otherwise, check player 1's snake
        snakeToCheck = player1Snake;
    }

    // Loop through each segment of the chosen snake
    for (var i = 0; i < snakeToCheck.length; i++) {
        var segment = snakeToCheck[i]; // Get the current segment of the snake

        // Check if the segment's coordinates match the given x and y
        if (segment.x === x && segment.y === y) {
            return true; // The cell is occupied by this segment of the snake
        }
    }

    return false; // The cell is not occupied by any segment of the snake
}

// Check if a snake has collided with itself
function checkForCollisions() {
    // Check if player 1's snake has collided with itself
    var hasPlayer1Collided = checkCollision(player1Snake);
    
    // Check if player 2's snake has collided with itself
    var hasPlayer2Collided = checkCollision(player2Snake);
    
    // If either of the players has collided, end the game
    if (hasPlayer1Collided || hasPlayer2Collided) {
        // Determine the winner. If player 1 collided, player 2 wins and vice versa
        if (hasPlayer1Collided) {
            endGame('Player 2');
        } else {
            endGame('Player 1');
        }
    }
}

// Eating and Power-ups
function eatFood(snake, player) {
    // Get the first segment of the snake, which is the head
    let head = snake[0];

    // Play the sound effect for eating food
    playSound('eatFoodSound');

    // Find the food on the game board
    let foodCell = document.querySelector('.food');

    // Split the ID of the food cell to get its x and y coordinates
    let foodX = parseInt(foodCell.id.split('-')[1]);
    let foodY = parseInt(foodCell.id.split('-')[2]);

    // Check if the snake's head is on the same spot as the food
    if (foodCell && head.x === foodX && head.y === foodY) {
        // If the snake eats the food, make the snake longer by adding a new segment at the end
        let newSegment = { ...snake[snake.length - 1] };
        snake.push(newSegment);

        // Remove the 'food' class from the cell to make it look like normal again
        foodCell.classList.remove('food');

        // Create new food at a different location
        generateFood();

        // Increase the player's score by 1
        updateScore(player, 1);
    }
}

function activatePowerUp() {
    // Activates the power-up for the respective player.
    // 1. Check the type of power-up.
    // 2. Activate the effect of the power-up.
    // 3. Show a timer or indicator for the duration of the power-up.
}

function clearGridPowerUp() {
    // Clears all power-ups/bombs from the grid.
}

function updateSnakeOnGrid(snake, playerClass) {
    // Go through all the grid cells and remove the class if it's the same as playerClass
    var allCells = document.querySelectorAll('.' + playerClass);
    for (var i = 0; i < allCells.length; i++) {
        allCells[i].classList.remove(playerClass);
    }

    // Remove the '-head' class from cells for the snake's head
    var headCells = document.querySelectorAll('.' + playerClass + '-head');
    for (var i = 0; i < headCells.length; i++) {
        headCells[i].classList.remove(playerClass + '-head');
    }

    // Loop through each part of the snake
    for (var i = 0; i < snake.length; i++) {
        var segment = snake[i];
        var cell = document.getElementById(`cell-${segment.x}-${segment.y}`);
        if (cell != null) {
            // Add the player class to the cell
            cell.classList.add(playerClass);

            // If this is the first segment (head), add the '-head' class
            if (i === 0) {
                cell.classList.add(playerClass + '-head');
            }
        }
    }
}

// Game State and Scoring
function updateScore(player, points, reset=false) {
    // Find the score element on the page for the given player
    var scoreElement = document.querySelector('#' + player + '-info .score span');

    // If we need to reset the score
    if (reset) {
        // Set the score to zero
        scoreElement.textContent = '0';
    } else {
        // Otherwise, add the points to the current score
        var currentScore = parseInt(scoreElement.textContent);
        // NaN handles manual error handling. Generated my ChatGPT.
        if (isNaN(currentScore)) {
            currentScore = 0;
        }
        var newScore = currentScore + points;
        scoreElement.textContent = newScore;
    }
}

function pauseGame() {
    // Check if the game is currently paused or not
    if (isGamePaused) {
        // If the game is paused, then resume it
        isGamePaused = false; // Set the game to be not paused

        // Start the game loop again
        gameInterval = setInterval(gameLoop, 150);

        // Change the text on the pause button to "Pause"
        document.querySelector('.pause-button').textContent = 'Pause';
    } else {
        // If the game is not paused, then pause it
        isGamePaused = true; // Set the game to be paused

        // Stop the game loop
        clearInterval(gameInterval);

        // Change the text on the pause button to "Resume"
        document.querySelector('.pause-button').textContent = 'Resume';
    }
}

// When the game ends, play sound effect. 
function endGame(winner) {
    playSound('snakeHit');
    // Stop the current gameloop (setInterval would execute at the )
    clearInterval(gameInterval);
    // Wait for the sound effect to play before pushing the alert
    // Avoids issue of playing the sound effect after.
    setTimeout(function() {
        alert(`${winner} wins!`);
        resetGame();
    }, 500); // 500 milliseconds delay
}

function displayPowerUpIcon(player, powerUpType) {
    // Displays the current power-up icon next to the player's score.
}

// Utility Functions - Code based on freeCodeCamp (https://forum.freecodecamp.org/t/math-floor-and-math-random-function/418969)
// Verified with ChatGPT
function generateFood() {
    if (!document.querySelector('.food')) { // Only generate food if it doesn't exist
        // Generate random coordinates for the food's position
        let x = Math.floor(Math.random() * 20);
        let y = Math.floor(Math.random() * 20);
        // Continue generating new coordinates until an unoccupied cell is found
        while (isCellOccupied(x, y, null)) {
            x = Math.floor(Math.random() * 20);
            y = Math.floor(Math.random() * 20);
        }

        // Get the cell at the generated coordinates
        let foodCell = document.getElementById(`cell-${x}-${y}`);

        // Add the 'food' class to this cell to display the food
        foodCell.classList.add('food');
    }
}

function generatePowerUp() {
    // Randomly generates a power-up on the board.
    // 1. Randomly select a position on the game grid.
    // 2. Ensure the selected position is not occupied by any snake.
    // 3. Place the food item on the selected position.
}

// Added a missing function to handle input keys (handling directions) of snakes
function updateDirection(key) {
    let newDirection;
    // Handles both lower and uppercase input
    switch(key.toLowerCase()) {
        case 'w': newDirection = 'up'; break;
        case 's': newDirection = 'down'; break;
        case 'a': newDirection = 'left'; break;
        case 'd': newDirection = 'right'; break;
        case 'arrowup': newDirection = 'up'; break;
        case 'arrowdown': newDirection = 'down'; break;
        case 'arrowleft': newDirection = 'left'; break;
        case 'arrowright': newDirection = 'right'; break;
        default: return; // Ignore other keys
    }

    /* Fixed issue with user selecting reverse direction and snake stopping.
    The snake should not respond to the reverse input direction. This is
    tracked by isOppositeDirection. */

    // Check for player 1
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
        if (!isOppositeDirection(player1Direction, newDirection) && gameStarted) {
            player1Direction = newDirection;
            canUpdatePlayer1Direction = false;
        }
    }

    // Check for player 2
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key == 'ArrowRight') {
        if (!isOppositeDirection(player2Direction, newDirection) && gameStarted) {
            player2Direction = newDirection;
            canUpdatePlayer2Direction = false;
        }
    }
}

// Wait until user clicks start before startGame function is executed. 
function waitForStart() {
    document.querySelector('.start-button').addEventListener('click', startGame);
}

// Code for the opposite direction (used above)
// Insight from ChatGPT fixed the opposite direction issue
function isOppositeDirection(currentDirection, newDirection) {
    // Mapped the opposite directions
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    return opposites[currentDirection] === newDirection;
}

// Function to disable the background music if the user clicks "Disable Music"
function soundOff(){
    const soundControl = document.querySelector('.toggle-sound-button');
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        soundControl.textContent = 'Disable Music'; // Replaces text button content
    } else {
        backgroundMusic.pause();
        soundControl.textContent = 'Play Music';
    }
}

// Function to control the background sound effects
function playSound(soundId) {
    if (soundEffectsEnabled) {
        const sound = document.getElementById(soundId);
        sound.play();
    }
}

// Need to add function for sound effects button (disable sound)
function toggleSoundEffects() {
    // Toggles the game sound effects on/off.
}

// 
document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        gameInterval = setInterval(gameLoop, 150);
        gameStarted = true;
        // Hide Start button
        document.querySelector('.start-button').style.display = 'none';
        document.querySelector('.toggle-sound-button').style.display = 'none';
        document.querySelector('.toggle-effects-button').style.display = 'none';

        // Show Pause and Reset buttons
        document.querySelector('.pause-button').style.display = 'block';
        document.querySelector('.reset-button').style.display = 'block';
    }

    console.log("Key Pressed:", event.key);
    // Update directions based on key press
    updateDirection(event.key);

    // Other keys remain the same
});

// Check for actions based on each button (controls)
document.querySelector('.pause-button').addEventListener('click', pauseGame);
document.querySelector('.reset-button').addEventListener('click', resetGame);
document.querySelector('.toggle-sound-button').addEventListener('click', soundOff);
document.querySelectorAll('.controls button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        playSound('buttonHoverSound');
    });
});

// This can be used to initialize the game when the page loads.
window.onload = initializeGame;