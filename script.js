const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
solved = 0;
canvas.width = 400;
canvas.height = 400;

const mazeSize = 10;
const cellSize = canvas.width / mazeSize;

let player = { x: 0, y: 0 };  // Start position
let end = { x: mazeSize - 1, y: mazeSize - 1 };  // End position

let maze = generateMaze(mazeSize, mazeSize);

// Updated Depth-First Search maze generation
function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1));

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function isValidMove(x, y) {
        return x >= 0 && x < width && y >= 0 && y < height && maze[y][x] === 1;
    }

    function carveMaze(x, y) {
        maze[y][x] = 0;  // Mark this cell as a path

        const directions = shuffle([
            { dx: 1, dy: 0 },  // Right
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: 1 },  // Down
            { dx: 0, dy: -1 }  // Up
        ]);

        for (const { dx, dy } of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;

            if (isValidMove(newX, newY)) {
                // Carve through the wall between the current cell and the new cell
                maze[y + dy][x + dx] = 0;
                carveMaze(newX, newY);
            }
        }
    }

    // Ensure end point is always reachable
    carveMaze(0, 0);  // Start carving from the top-left corner
    maze[height - 1][width - 1] = 0;  // Ensure the end point is reachable
    maze[height - 2][width - 1] = 0;  // Ensure a path to the bottom-right
    maze[height - 1][width - 2] = 0;  // Ensure a path to the right

    return maze;
}

// Draw the maze
function drawMaze() {
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black'; // Wall
            } else {
                ctx.fillStyle = 'white'; // Path
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // Draw the player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

    // Draw the end point
    ctx.fillStyle = 'green';
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
}

// Move the player
function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        if (player.x === end.x && player.y === end.y) {
            msgele = document.getElementById('msg');
            solved += 1;
            msg = "Congratulations! You've solved ".concat( solved.toString(), " games" );
            msgele.innerHTML = msg;
            // alert( msg );
            resetGame();
        }
    }
    drawMaze();
}

// Keydown event to move the player
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Reset the game
function resetGame() {
    player = { x: 0, y: 0 };
    maze = generateMaze(mazeSize, mazeSize);
    drawMaze();
}

// Initialize the maze
drawMaze();
