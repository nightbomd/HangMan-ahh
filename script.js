const words = ["JIMMY", "HANGMAN", "PROGRAMMING", "DEVELOPER", "COMPUTER"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let selectedWord = "";
let underScores = [];
let buttons = [];
let guessedLetters = [];
let lives = 6;

// prevents merging texts when clicking multiple times quickly
let nartTimeOuts = [];
let jimmyTimeOuts = [];

const guessBtn = document.getElementById("guess-btn");
const submitBtn = document.getElementById("submit-guess-btn");
const guessInput = document.getElementById("guess-word-input");



function makeButtons() {
    const letterBox = document.getElementById("letter-box");

    for (let i = 0; i < alphabet.length; i++) {
        const button = document.createElement("button");

        button.textContent = alphabet[i];
        button.classList.add("letter-button");

        button.addEventListener("click", () => {
            button.disabled = true;
            doTheGame(button.textContent);
        });

        letterBox.appendChild(button);
        buttons.push(button);
    }
}

function updateNarrative(text) {
    const narText = document.getElementById("narText");

    // Clear any existing text and timeouts
    narText.textContent = "";
    nartTimeOuts.forEach(timeout => clearTimeout(timeout));
    nartTimeOuts = [];


    narText.textContent = "";

    const letters = text.split("");

    letters.forEach((char, index) => {
        const t = setTimeout(() => {
            narText.textContent += char;
        }, index * 50);
        nartTimeOuts.push(t);
    });
}
function updateJimmyText(text) {
    const jimmyText = document.getElementById("jimmy-text");

    jimmyTimeOuts.forEach(timeout => clearTimeout(timeout));
    jimmyTimeOuts = [];

    jimmyText.textContent = "";

    const letters = text.split("");

    letters.forEach((char, index) => {
        const t = setTimeout(() => {
            jimmyText.textContent += char;
        }, index * 50);
        jimmyTimeOuts.push(t);
    });
}
function makeUnderscores() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    underScores = [];

    for (let i = 0; i < selectedWord.length; i++) {
        const underscore = document.createElement("div");
        underscore.classList.add("underscore");
        setTimeout(() => {
            underscore.classList.add("bounce-in");
        }, i * 150);

        document.getElementById("word-box").appendChild(underscore);
        underScores.push(underscore);
    }
}
function flashRed() {
    const flash = document.getElementById("flash");

    // remove class if already there to re-trigger
    flash.classList.remove("flash-red");

    // force reflow so the browser registers the removal
    void flash.offsetWidth;

    flash.classList.add("flash-red");
}

function doTheGame(letter) {


    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);

    if (guessedLetters.length > 4) {
        guessBtn.style.display = "block";
    }

    let found = false;

    for (let i = 0; i < selectedWord.length; i++) {

        if (letter === selectedWord[i]) {
            underScores[i].textContent = letter;
            found = true;
        }
    }
    if (found) {
        updateNarrative("Good guess!");
        updateJimmyText("Yay!");
    }

    if (!found) {
        lives--;
        updateNarrative(`Wrong guess! Lives remaining: ${lives}`);
        updateJimmyText("Ow why'd you do that?");
        flashRed();
        setTimeout(() => {
            updateJimmyText("freaking douchebag...");
        }, 3000);
        document.getElementById("lives").textContent = "❤️ ".repeat(lives);

    }

    if (underScores.every((underscore, index) =>
        underscore.textContent === selectedWord[index])) {

        updateNarrative("Congratulations! You've guessed the word!");
        updateJimmyText("Yay!");
        gamewon=true;
    }
    
    if (lives === 0) {
        updateNarrative(`Game Over! The word was: ${selectedWord}`);
    }

}
function updateUi() {
    window.addEventListener("load", () => {
        updateNarrative("Hey guys its little jimmy");
        updateJimmyText("hi guys");
        makeButtons();
        makeUnderscores();
        const livesText = document.getElementById("lives");
        livesText.textContent = "❤️ ".repeat(lives); // works now

    });
}
guessBtn.addEventListener("click", () => {
    submitBtn.style.display = "block";
    guessInput.style.display = "block";

});
submitBtn.addEventListener("click", () => {
    const guess = guessInput.value.toUpperCase();

    if (guess === selectedWord) {
        underScores.forEach((underscore, index) => {
            underscore.textContent = selectedWord[index];
        });

        updateNarrative("Congratulations! You've guessed the word!");
        updateJimmyText("Yay!");
        submitBtn.style.display = "none";
        guessInput.style.display = "none";
        guessBtn.style.display = "none";

    } else {
        lives--;
        guessBtn.style.display = "none";
        submitBtn.style.display = "none";
        guessInput.style.display = "none";
        updateNarrative(`nope. ${lives} remaining`);
        updateJimmyText("dude bro stop");
        flashRed();
    }
});
// toggle dark mode in js
function invertColors() {
    document.body.classList.toggle("dark");
    setTimeout(() => {
        underScores.forEach(el => {
            el.classList.toggle("underscore-dark");
        });
    }, 150);

    setTimeout(() => {
        buttons.forEach(el => {
            el.classList.toggle("letter-button-dark");
        });
    }, 150);

    setTimeout(() => {
        document.getElementById("shadow").classList.toggle("shadow-light");
    }, 150);
}
updateUi();
