const inputController = (() => {
    let playerX = null, playerO = null;
    let humanPlayer = null;
    const setplayersName = (playerXInput, playerOInput) => {
        playerX = playerXInput;
        playerO = playerOInput;
    }

    const getPlayersName = () => {
        return { playerX, playerO };
    }

    const setHumanPlayerName = (humanPlayerInput) => {
        humanPlayer = humanPlayerInput;
    }

    const getHumanPlayerName = () => {
        return humanPlayer;
    }

    return {
        setplayersName,
        setHumanPlayerName,
        getPlayersName,
        getHumanPlayerName,
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
    const modalMsg = document.querySelector(".modal-msg");
    const cells = document.querySelectorAll(".cell");

    const resetGameBoard = () => {
        cells.forEach(cell => {
            cell.innerText = "";
        });
    }

    const displayMessage = (msg) => {
        modalMsg.innerText = msg;
    }

    const displayModal = (msg) => {
        modal.classList.toggle("show-flex");
        if (msg === null) {
            resetGameBoard();
        }
        else {
            displayMessage(msg);
        }
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
        displayModal,
    }
})();

const confetti = (() => {
    const confettiContainer = document.querySelector(".modal");
    const animItem = bodymovin.loadAnimation({
        wrapper: confettiContainer,
        animType: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets4.lottiefiles.com/packages/lf20_gz82sbil.json",
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            className: "confetti-canvas",
        },
    });

    return {
        animItem,
    }
})();

const game = (() => {
    const cells = document.querySelectorAll(".cell");
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

    const checkWin = (currentTurn) => {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].innerText === currentTurn;
            });
        });
    }

    const checkDraw = () => {
        return [...cells].every(cell => {
            return cell.innerText === 'X' || cell.innerText === 'O';
        });
    }

    return {
        checkWin,
        checkDraw,
    }
})();

const twoPlayerModeGameplay = (() => {
    let turnOfX = true;
    const cells = document.querySelectorAll(".cell");
    const { playerX, playerO } = inputController.getPlayersName();

    const getTurn = () => {
        return turnOfX ? 'X' : 'O';
    }

    const switchTurns = () => {
        turnOfX = !turnOfX;
    }

    const markCell = (e) => {
        let currentTurn = getTurn();
        e.target.innerText = currentTurn === 'X' ? 'X' : 'O';
        const win = game.checkWin(currentTurn);
        const draw = game.checkDraw();
        if (win) {
            const winner = currentTurn === 'X' ? playerX : playerO;
            displayController.displayModal(`${winner} Won`);
            confetti.animItem.play();
            return true;
        }
        else if (draw) {
            confetti.animItem.stop();
            displayController.displayModal(`It's a Draw`);
            return true;
        }
        else {
            switchTurns();
            currentTurn = getTurn();
            displayController.updatePlayerTurn(currentTurn);
        }
    }

    cells.forEach(cell => {
        cell.addEventListener("click", markCell, { once: true });
    });
});

const botModeGameplay = (() => {
    const cells = document.querySelectorAll(".cell");
    const humanPlayerName = inputController.getHumanPlayerName();
    const board = document.querySelector(".board");

    let turnOfX = true;

    const getTurn = () => {
        return turnOfX ? 'X' : 'O';
    }

    const switchTurns = () => {
        turnOfX = !turnOfX;
    }

    const getEmptyCells = () => {
        const emptyCells = [];
        [...cells].forEach(cell => {
            if (cell.innerText === '') {
                emptyCells.push(cell);
            }
        });
        return emptyCells;
    };

    const botMove = () => {
        const emptyCellsArr = getEmptyCells();
        const botInput = Math.ceil(Math.random() * emptyCellsArr.length) - 1;
        if (botInput >= 0) {
            emptyCellsArr[botInput].innerText = 'O';
        }
    }

    const getResults = () => {
        const currentTurn = getTurn();
        const win = game.checkWin(currentTurn);
        const draw = game.checkDraw();
        if (win) {
            const winner = currentTurn === 'X' ? humanPlayerName : 'Bot';
            displayController.displayModal(`${winner} Won`);
            confetti.animItem.play();
            return true;
        }
        else if (draw) {
            confetti.animItem.stop();
            displayController.displayModal(`It's a Draw`);
            return true;
        }
        return false;
    }

    const markCell = (e) => {
        if (e.target.innerText === '') {
            e.target.innerText = 'X';   // Mark player's move
            if (getResults()) {
                return;
            }
            board.classList.toggle("stop-click");
            displayController.updatePlayerTurn('O');
            setTimeout(() => {
                switchTurns();
                botMove(e);  // Mark bot's move
                getResults();
                switchTurns();
                displayController.updatePlayerTurn('X');
                board.classList.toggle("stop-click");
            }, 1000);
        }
    }

    cells.forEach(cell => {
        // once:true so that the move can't be alter once clicked
        cell.addEventListener("click", markCell, { once: true });
    });
});

const gameController = (() => {
    const modes = document.querySelectorAll(".mode");
    const returnBtns = document.querySelectorAll(".return-btn");
    const nameForms = document.querySelectorAll(".name-form");
    const playerXInput = document.querySelector("#player-x");
    const playerOInput = document.querySelector("#player-o");
    const humanPlayerInput = document.querySelector("#human");
    const modal = document.querySelector(".modal");

    let mode;
    const setMode = (e) => {
        mode = e.target.id;
        displayController.displayNameInputScreen(e);
    }

    const gameplay = () => {
        if (mode === "bot") {
            inputController.setHumanPlayerName(humanPlayerInput.value);
            displayController.updatePlayerTurn('X');
            botModeGameplay();
        }
        else {
            inputController.setplayersName(playerXInput.value, playerOInput.value);
            displayController.updatePlayerTurn('X');
            twoPlayerModeGameplay();
        }
    }

    const startGame = (e) => {
        e.preventDefault();
        displayController.displayGameBoardScreen();
        gameplay();
    }

    const resetGame = () => {
        displayController.displayModal(null);
        displayController.updatePlayerTurn('X');
        gameplay();
    }

    // Event Listeners
    modes.forEach(mode => {
        mode.addEventListener("click", setMode);
    });
    nameForms.forEach(nameForm => {
        nameForm.addEventListener("submit", startGame);
    });
    // For return button on both the screens
    returnBtns.forEach(returnBtn => {
        returnBtn.addEventListener("click", displayController.returntoMainScreen);
    });
    modal.addEventListener("click", resetGame);
})(); 