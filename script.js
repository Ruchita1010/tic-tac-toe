const displayController = (() => {
    // Getting all the required HTML elements
    const modesScreen = document.querySelector(".modes-screen");
    const gameBoardScreen = document.querySelector(".game-board-screen");
    const modes = document.querySelectorAll(".mode");
    const nameInputScreen = document.querySelector(".name-input-screen");
    const twoPlayerModeInput = document.querySelector(".two-player-mode-input");
    const botModeInput = document.querySelector(".bot-mode-input");
    const startBtn = document.querySelector("#start-btn");

    const displayNameInputScreen = (e) => {
        modesScreen.classList.toggle("hide");
        nameInputScreen.classList.toggle("show");
        const mode = e.target.id;
        switch (mode) {
            case "two-player":
                twoPlayerModeInput.classList.toggle("show");
                break;
            case "bot":
                botModeInput.classList.toggle("show");
                break;
        }
    }

    const displayGameBoardScreen = () => {
        nameInputScreen.classList.toggle("show");
        gameBoardScreen.classList.toggle("show");
    }

    // Event Listeners
    modes.forEach(mode => {
        mode.addEventListener("click", displayNameInputScreen);
    });
    startBtn.addEventListener("click", displayGameBoardScreen);
})();

const gameBoard = (() => {
    let X = true;
    const cells = document.querySelectorAll(".cell");

    const switchTurns = () => {
        X = !X;
    }

    const markCell = (e) => {
        const currentTurn = X ? 'X' : 'O';
        e.target.innerHTML = currentTurn;
        switchTurns();
    }

    cells.forEach(cell => {
        // once:true so that the move can't be alter once clicked
        cell.addEventListener("click", markCell, { once: true });
    });
})();