const inputController = (() => {
    let playerX = null, playerO = null;
    const setplayersName = (playerXInput, playerOInput) => {
        playerX = playerXInput;
        playerO = playerOInput;
    }

    const getPlayersName = () => {
        return { playerX, playerO };
    }

    return {
        setplayersName,
        getPlayersName,
    }
})();

const displayController = (() => {
    // Getting all the required HTML elements
    const modesScreen = document.querySelector(".modes-screen");
    const gameBoardScreen = document.querySelector(".game-board-screen");
    const nameInputScreen = document.querySelector(".name-input-screen");
    const twoPlayerModeInput = document.querySelector(".two-player-mode-input");
    const botModeInput = document.querySelector(".bot-mode-input");
    const playerTurnDisplay = document.querySelector(".player-turn-display").getElementsByTagName("span")[0];
    const modal = document.querySelector(".modal");
    const winnerName = document.querySelector(".winner-name");

    const displayWinner = (winner) => {
        modal.classList.toggle("show-flex");
        winnerName.innerText = `${winner} Won`;
    }

    const updatePlayerTurn = (nextTurn) => {
        playerTurnDisplay.innerText = nextTurn;
    }

    const displayNameInputScreen = (e) => {
        modesScreen.classList.toggle("hide");
        nameInputScreen.classList.toggle("show-flex");
        const mode = e.target.id;
        switch (mode) {
            case "two-player":
                twoPlayerModeInput.classList.toggle("show-flex");
                break;
            case "bot":
                botModeInput.classList.toggle("show-flex");
                break;
        }
    }

    const displayGameBoardScreen = () => {
        nameInputScreen.classList.toggle("show-flex");
        gameBoardScreen.classList.toggle("show");
    }

    const returntoMainScreen = () => {
        location.reload();
    }

    return {
        updatePlayerTurn,
        displayNameInputScreen,
        displayGameBoardScreen,
        returntoMainScreen,
        displayWinner,
    }
})();

const win = (() => {
    const { playerX, playerO } = inputController.getPlayersName();

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const check = (cells, currentTurn) => {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].innerHTML === currentTurn;
            });
        });
    }

    const get = (currentTurn) => {
        if (currentTurn === 'X') {
            return playerX;
        }
        return playerO;
    }

    return {
        check,
        get,
    }
});

const gameBoard = (() => {
    let turnOfX = true;

    const cells = document.querySelectorAll(".cell");

    const getTurn = () => {
        return turnOfX ? 'X' : 'O';
    }

    const switchTurns = () => {
        turnOfX = !turnOfX;
    }

    const checkWin = (currentTurn) => {
        const result = win().check(cells, currentTurn);
        if (result) {
            const winner = win().get(currentTurn);
            displayController.displayWinner(winner);
        }
    }

    const markCell = (e) => {
        const currentTurn = getTurn();
        e.target.innerHTML = currentTurn === 'X' ? 'X' : 'O';
        switchTurns();
        checkWin(currentTurn);
        const nextTurn = getTurn();
        displayController.updatePlayerTurn(nextTurn);
    }

    cells.forEach(cell => {
        // once:true so that the move can't be alter once clicked
        cell.addEventListener("click", markCell, { once: true });
    });
});

const gameController = (() => {
    const modes = document.querySelectorAll(".mode");
    const startBtn = document.querySelector("#start-btn");
    const returnBtns = document.querySelectorAll(".return-btn");
    const playerXInput = document.querySelector("#player-x");
    const playerOInput = document.querySelector("#player-o");

    const startGame = () => {
        inputController.setplayersName(playerXInput.value, playerOInput.value);
        displayController.updatePlayerTurn(playerXInput.value);
        displayController.displayGameBoardScreen();
        gameBoard();
    }

    // Event Listeners
    modes.forEach(mode => {
        mode.addEventListener("click", displayController.displayNameInputScreen);
    });
    startBtn.addEventListener("click", startGame);
    // For return button on both the screens
    returnBtns.forEach(returnBtn => {
        returnBtn.addEventListener("click", displayController.returntoMainScreen);
    });
})(); 