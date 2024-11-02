let gameMode = "";
let player1Name = "";
let player2Name = "";
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

function chooseGameMode(mode) {
    gameMode = mode;
    document.getElementById("game-options").style.display = "none";
    document.getElementById("player-names").style.display = "block";
    if (gameMode === "computer") {
        document.getElementById("player2-name").style.display = "none"; // Hide Player 2 input for computer mode
    } else {
        document.getElementById("player2-name").style.display = "block"; // Show Player 2 input for two-player mode
    }
}

function startTicTacToe() {
    player1Name = document.getElementById("player1-name").value || "Player 1";
    player2Name = gameMode === "computer" ? "Harry" : document.getElementById("player2-name").value || "Player 2";

    document.getElementById("player-names").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("status").innerText = `${player1Name}'s Turn (X)`;
}

function makeMove(index) {
    if (gameBoard[index] === "" && !gameOver) {
        gameBoard[index] = currentPlayer;
        document.getElementsByClassName("cell")[index].innerText = currentPlayer;
        checkWinner();

        if (!gameOver) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (gameMode === "computer" && currentPlayer === "O") {
                setTimeout(computerMove, 500);
            } else {
                document.getElementById("status").innerText = `${currentPlayer === "X" ? player1Name : player2Name}'s Turn (${currentPlayer})`;
            }
        }
    }
}

function computerMove() {
    const bestMove = minimax(gameBoard, "O").index;
    makeMove(bestMove);
}

function minimax(board, player) {
    const availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWinCondition(board, "X")) return { score: -10 };
    if (checkWinCondition(board, "O")) return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves = [];
    for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = player;

        const result = minimax(newBoard, player === "O" ? "X" : "O");
        moves.push({ index: move, score: result.score });
    }

    return moves.reduce((best, move) => {
        if ((player === "O" && move.score > best.score) || (player === "X" && move.score < best.score)) {
            return move;
        }
        return best;
    }, { score: player === "O" ? -Infinity : Infinity });
}

function checkWinCondition(board, player) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombos.some(combo => combo.every(index => board[index] === player));
}

function checkWinner() {
    if (checkWinCondition(gameBoard, "X")) {
        document.getElementById("status").innerText = `${player1Name} Wins!`;
        gameOver = true;
    } else if (checkWinCondition(gameBoard, "O")) {
        document.getElementById("status").innerText = `${player2Name} Wins!`;
        gameOver = true;
    } else if (!gameBoard.includes("")) {
        document.getElementById("status").innerText = "It's a Draw!";
        gameOver = true;
    }
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    currentPlayer = "X";
    Array.from(document.getElementsByClassName("cell")).forEach(cell => cell.innerText = "");
    document.getElementById("status").innerText = `${player1Name}'s Turn (X)`;
}

function goBack() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("game-options").style.display = "block";
    document.getElementById("player-names").style.display = "none";
    
    gameMode = "";
    player1Name = "";
    player2Name = "";
    resetGame();
}
