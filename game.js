// Course: SENG 513
// Date: October 20, 2023
// Assignment 2
// Name: Harsanjit Bhullar
// UCID: 30006252

// Initialization Functions
function initializeGame() {
    // 1. Set up the game grid.
    // 2. Place the snakes (player 1 and player 2) at their starting positions.
    // 3. Generate the initial food item on the grid.
    // 4. Set initial scores to 0 for both players.
    // 5. Display any initial instructions or UI elements.
    // 6. Wait for the player to press the "Start" button.
}

function resetGame() {
    // 1. Clear the game grid.
    // 2. Call the initializeGame function.
    // Resets the game to its initial state.
}

// Player Movement Functions
function movePlayer1() {
    // Handles Player 1 movement.
    // 1. Check the direction the player is moving.
    // 2. Update the player's position on the grid based on the direction.
    // 3. Check for collisions using the checkCollision function.
    // 4. Check if the player eats any food using the eatFood function.
    // 5. Update the game state.
}

function movePlayer2() {
    // Handles Player 2 movement.
    // 1. Check the direction the player is moving.
    // 2. Update the player's position on the grid based on the direction.
    // 3. Check for collisions using the checkCollision function.
    // 4. Check if the player eats any food using the eatFood function.
    // 5. Update the game state.
}

// Collision Detection
function checkCollision() {
    // Check if the snake hits the boundaries or itself.
    // 1. Check the boundaries of the game grid.
    //    - If the snake goes outside the boundaries, end the game.
    // 2. Check if the snake collides with itself.
    //    - If yes, end the game.
    // 3. Check if the snake collides with the other player's snake.
    //    - If yes, end the game.
}

// Eating and Power-ups
function eatFood() {
    // Handles what happens when the snake eats food.
    // 1. Check if the snake's head position matches the food's position.
    // 2. If yes:
    //    - Increase the snake's length.
    //    - Update the score.
    //    - Generate a new food item on the grid using the generateFood function.
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

// Game State and Scoring
function updateScore(player, points) {
    // Updates the score for the given player.
    // 1. Take the player and points as parameters.
    // 2. Update the player's score by adding the given points.
    // 3. Display the new score on the UI.
}

function pauseGame() {
    // Pauses the game.
}

function endGame() {
    // Ends the game and displays the winner.
    // 1. Display the winner based on scores or conditions.
    // 2. Show an option to restart or go back to the main menu.
}

// UI and Sound Updates
function toggleMusic() {
    // Toggles the game music on/off.
}

function toggleSoundEffects() {
    // Toggles the game sound effects on/off.
}

function displayPowerUpIcon(player, powerUpType) {
    // Displays the current power-up icon next to the player's score.
}

// Utility Functions
function generateFood() {
    // Randomly generates food on the game board.
}

function generatePowerUp() {
    // Randomly generates a power-up on the board.
    // 1. Randomly select a position on the game grid.
    // 2. Ensure the selected position is not occupied by any snake.
    // 3. Place the food item on the selected position.
}

function isValidMove(direction, player) {
    // Checks if the new direction is a valid move.
    // 1. 1. Check if the new direction is opposite to the current direction (e.g., can't go from "up" to "down" immediately).
    // 2. If yes, return false.
    // 3. Else, return true.
}

// This can be used to initialize the game when the page loads.
window.onload = initializeGame;
