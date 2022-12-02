// theme swithcer logic
const themeSwitcher = document.querySelector("[data-theme-switcher]");
const themeSwitcherIconLight = document.querySelector("[data-theme-icon-light]");
const themeSwitcherIconDark = document.querySelector("[data-theme-icon-dark]");

window.addEventListener("storage", (e) => {
    let theme = e.newValue;
    setPrefferedTheme(theme);
});

themeSwitcher.addEventListener("click", () => {
    toggleTheme();
});

if (localStorage.getItem("prefferedTheme")) {
    let theme = getPreferedTheme();
    setPrefferedTheme(theme);
} else {
    let theme = window.matchMedia(`(prefers-color-scheme: dark)`).matches ? "light-theme" : "dark-theme";
    setPrefferedTheme(theme);
    updateStorage(theme);
}

function setPrefferedTheme(prefTheme) {
    document.documentElement.className = "";
    document.documentElement.className = prefTheme;
    updateShowingIcon(prefTheme);
}

function toggleTheme() {
    let theme = document.documentElement.className === "light-theme" ? "dark-theme" : "light-theme";
    setPrefferedTheme(theme);
    updateStorage(theme);
}

function updateStorage(theme) {
    localStorage.setItem("prefferedTheme", theme);
}

function getPreferedTheme() {
    return localStorage.getItem("prefferedTheme") === "light-theme" ? "light-theme" : "dark-theme";
}

function updateShowingIcon(theme) {
    if (theme === "light-theme") {
        themeSwitcherIconDark.classList.remove("hide")
        themeSwitcherIconLight.classList.remove("hide")
        themeSwitcherIconLight.classList.add("hide")
    } else {
        themeSwitcherIconDark.classList.remove("hide")
        themeSwitcherIconLight.classList.remove("hide")
        themeSwitcherIconDark.classList.add("hide")
    }
}

// game logic 
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageOverlayContainer = document.getElementById("winning-message-container");
const winningMessageTextElement = document.querySelector("[data-winning-text]");
const restartBtn = document.getElementById("restart-btn");

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
let circleTurn;
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

function startGame() {
    circleTurn = false;
    cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageOverlayContainer.classList.remove("showing");
}

function handleClick(e) {
    let cell = e.target;
    let currentTurn = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentTurn);
    // provjera za pobjedu
    if (checkForWin(currentTurn)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentTurn) {
    cell.classList.add(currentTurn);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkForWin(currentTurn) {
    return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
            return cellElements[index].classList.contains(currentTurn);
        });
    });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "Draw!";
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's " : "X's"} Wins!`;
    }
    winningMessageOverlayContainer.classList.add("showing");
}

function isDraw() {
    return [...cellElements].every((cell) => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    });
}

restartBtn.addEventListener("click", startGame);