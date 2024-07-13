var arr = [[], [], [], [], [], [], [], [], []];

// Populate the arr array with references to the DOM elements
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = [[], [], [], [], [], [], [], [], []];

// Function to fill the board array with the puzzle data
function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

// Fetch the puzzle from the API
GetPuzzle.onclick = function() {
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.open('GET', 'https://sudoku-api.vercel.app/api/dosuku', true);
    xhrRequest.onload = function() {
        if (xhrRequest.status >= 200 && xhrRequest.status < 300) {
            try {
                var response = JSON.parse(xhrRequest.responseText);
                console.log(response);
                
                // Assuming the puzzle is in response.newboard.grids[0].value
                var puzzle = response.newboard.grids[0].value;

                // Populate the board array with the puzzle data
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        board[i][j] = puzzle[i][j];
                    }
                }
                FillBoard(board);
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
            }
        } else {
            console.error("Request failed with status:", xhrRequest.status);
        }
    };
    xhrRequest.onerror = function() {
        console.error("Request failed");
    };
    xhrRequest.send();
};

// Solve the puzzle and update the board
SolvePuzzle.onclick = () => {
    console.log("SolvePuzzle button clicked");
    sudokuSolver(board, 0, 0, 9);
};

function isValid(board, i, j, num, n) {
    // Row check
    for (let x = 0; x < n; x++) {
        if (board[i][x] == num) {
            return false;
        }
    }

    // Column check
    for (let x = 0; x < n; x++) {
        if (board[x][j] == num) {
            return false;
        }
    }

    // Sub-Matrix Check
    let rn = 3; // For standard Sudoku, the sub-grid size is 3x3
    let si = i - (i % rn);
    let sj = j - (j % rn);

    for (let x = si; x < si + rn; x++) {
        for (let y = sj; y < sj + rn; y++) {
            if (board[x][y] == num) {
                return false;
            }
        }
    }

    return true;
}

function sudokuSolver(board, i, j, n) {
    // Base Case
    if (i == n) {
        console.log("Puzzle solved");
        FillBoard(board);
        return true;
    }

    // If we are not inside the board
    if (j == n) {
        return sudokuSolver(board, i + 1, 0, n);
    }

    // If cell is already filled ->> just move forward
    if (board[i][j] != 0) {
        return sudokuSolver(board, i, j + 1, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, j, num, n)) {
            board[i][j] = num;
            console.log(`Trying ${num} at position (${i}, ${j})`);

            let subAns = sudokuSolver(board, i, j + 1, n);

            if (subAns) {
                return true;
            }

            // Back-Tracking -->> Undo the change
            board[i][j] = 0;
            console.log(`Backtracking from position (${i}, ${j})`);
        }
    }

    return false;
}
