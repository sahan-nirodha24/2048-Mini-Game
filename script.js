const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart');

let score = 0;
let board = Array.from({ length: 4 }, () => Array(4).fill(0));

function initGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
}

function addRandomTile() {
    const emptyTiles = [];
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === 0) {
                emptyTiles.push({ row: rowIndex, col: colIndex });
            }
        });
    });
    if (emptyTiles.length) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    grid.innerHTML = '';
    board.forEach(row => {
        row.forEach(tile => {
            const cell = document.createElement('div');
            cell.className = `cell cell-${tile}`;
            cell.textContent = tile > 0 ? tile : '';
            grid.appendChild(cell);
        });
    });
    scoreDisplay.textContent = `Score: ${score}`;
}

function slide(row) {
    const filtered = row.filter(tile => tile);
    const empty = Array(4 - filtered.length).fill(0);
    return [...filtered, ...empty];
}

function combine(row) {
    for (let i = 3; i > 0; i--) {
        if (row[i] === row[i - 1] && row[i] !== 0) {
            row[i] *= 2;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return slide(row);
}

function move(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            for (let col = 0; col < 4; col++) {
                const column = board.map(row => row[col]);
                const newColumn = combine(slide(column));
                for (let row = 0; row < 4; row++) {
                    if (board[row][col] !== newColumn[row]) {
                        moved = true;
                    }
                    board[row][col] = newColumn[row];
                }
            }
            break;
        case 'down':
            for (let col = 0; col < 4; col++) {
                const column = board.map(row => row[col]).reverse();
                const newColumn = combine(slide(column)).reverse();
                for (let row = 0; row < 4; row++) {
                    if (board[row][col] !== newColumn[row]) {
                        moved = true;
                    }
                    board[row][col] = newColumn[row];
                }
            }
            break;
        case 'left':
            for (let row = 0; row < 4; row++) {
                const newRow = combine(slide(board[row]));
                if (board[row].some((tile, index) => tile !== newRow[index])) {
                    moved = true;
                }
                board[row] = newRow;
            }
            break;
        case 'right':
            for (let row = 0; row < 4; row++) {
                const newRow = combine(slide(board[row]).reverse()).reverse();
                if (board[row].some((tile, index) => tile !== newRow[index])) {
                    moved = true;
                }
                board[row] = newRow;
            }
            break;
    }
    if (moved) {
        addRandomTile();
        updateGrid();
        if (checkGameOver()) {
            alert("Game Over!");
            initGame();
        }
    }
}

function checkGameOver() {
    return !board.some(row => row.includes(0) || row.some((tile, index) => tile === row[index + 1]));
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

restartButton.addEventListener('click', initGame);

initGame();
