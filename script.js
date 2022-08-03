const displayController = (() => {
    const modesContainer = document.querySelector(".modes-container");
    const board = document.querySelector(".board");
    const modes = document.querySelectorAll(".mode");

    const toggleScreen = () => {
        modesContainer.classList.toggle("hide");
        board.classList.toggle("show");
    }

    modes.forEach(mode => {
        mode.addEventListener("click", toggleScreen);
    });
})();