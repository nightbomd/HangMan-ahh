const mediumWords = ["JIMMY", "BANANA", "COMPUTER", "PYTHON", "HANGMAN", "DEVELOPER", "JAVASCRIPT", "PROGRAMMING", "ALGORITHM", "FUNCTION", "stickman",];
const easyWords = ["CAT", "DOG", "CAR", "TREE", "BOOK", "HOUSE", "BALL", "CUP", "PHONE", "TABLE", "war", "ink", "stick"];
const hardWords = ["SOLLOQUY", "CONSEQUENTIALLY", "SHADENFREUDE", "UNCHARACTERISTICALLY", "INCOMPREHENSIBILITY", "MISUNDERSTANDING", "PHILANTHROPIC", "RECOMMENDATION", "SUBSTANTIATION"];
const wordLists = [easyWords, mediumWords, hardWords];
const healthBar = document.getElementById("bar-inner");

// 0, 1, 2 represent the difficulty in ascending order
let difficulty = Math.floor(Math.random() * wordLists.length);
let words = wordLists[difficulty];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let selectedWord = "";
// becuase the loop creates the buttons and underscores, you have to store them in a array to make them usable
let underScores = [];
let buttons = [];

let guessedLetters = [];
let lives = 8;
let maxLives = 8
let gameWon = false;

// prevents merging texts when clicking multiple times quickly
let nartTimeOuts = [];
let jimmyTimeOuts = [];

const guessBtn = document.getElementById("guess-btn");
const submitBtn = document.getElementById("submit-guess-btn");
const guessInput = document.getElementById("guess-word-input");
const newGameBtn = document.getElementById("new-game-btn");
const difficultyText = document.getElementById("difficulty")
const difficultyBtn = document.getElementById("difficulty-btn");


function makeButtons() {
    const letterBox = document.getElementById("letter-box");
    // create enough buttons for each letter
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

    narText.textContent = "";
    // this is supposed to prevent overlapping
    nartTimeOuts.forEach(timeout => clearTimeout(timeout));
    nartTimeOuts = [];

    const letters = text.split("");
    // split basically just creates an array of characters

    // so this is making the text an array and displaying each chracter with a time of 50ms, that's what makes the typing effect
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

    // the loop runs equivlanet to the length of the word, or how many letters the word is
    for (let i = 0; i < selectedWord.length; i++) {
        const underscore = document.createElement("div");
        underscore.classList.add("underscore");
        // add a 150ms cooldown for each underscore
        setTimeout(() => {
            underscore.classList.add("bounce-in");
        }, i * 150);

        // each underscore is a div, so you have to create a div element
        document.getElementById("word-box").appendChild(underscore);
        underScores.push(underscore);
    }
}

// offSetWidth allows you to do it again
function flashRed() {
    const flash = document.getElementById("flash");
    flash.classList.remove("flash-red");
    void flash.offsetWidth;
    flash.classList.add("flash-red");
}
function animateHealthBar() {
    healthBar.classList.remove("hit-effect");
    void healthBar.offsetWidth;
    healthBar.classList.add("hit-effect");

}
function playSound(file) {
    // pause it if it's currently playing
    if (playSound.current) {
        playSound.current.pause();
        playSound.current.currentTime = 0;
    }
    // built in thingy that makes a class or something just know it plays the sound
    const audio = new Audio(file);
    audio.volume = 0.8;
    audio.play();
    playSound.current = audio;
}

function stopActiveSound() {
    if (playSound.current) {
        playSound.current.pause();
        playSound.current.currentTime = 0;
    }
}

function endGame() {
    // for each is an array method that loops through a specific array and takes a paramter (usually the singular form).
    buttons.forEach(button => {
        button.disabled = true;
    });
    newGameBtn.style.display = "block";
    guessBtn.style.display = "none";
    submitBtn.style.display = "none";
    guessInput.style.display = "none";
    document.getElementById("typeWord").style.display = "none";
}

// the parameter is the string value of the clicked button
function doTheGame(letter) {
    if (gameWon || lives === 0) return; // dont do anything if the game is over
    if (guessedLetters.includes(letter)) return; // if the letter is already in the array dont do anything


    guessedLetters.push(letter);
    // if the user has guessed more than 4 letters, show the guess button
    if (guessedLetters.length > 4) {
        guessBtn.style.display = "block";
        guessBtn.classList.add("bounce-in");
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
    } else {
        lives--;
        playSound("slap.mp3")
        animateHealthBar()
        
        setTimeout(() => {
            // this is the formula to create any bar that updates based on input. Its basically element = (lower value / greater value) * 100 + "%". Essnetially just make it the percent of the whole thing
            healthBar.style.width = (lives / maxLives) * 100 + "%"

        }, 200);
        updateNarrative(`Wrong guess! Lives remaining: ${lives}`);
        updateJimmyText("Ow why'd you do that?");
        flashRed();


        if (lives > 0) {
            setTimeout(() => {
                updateJimmyText("lock in unc");
            }, 3000);
        }
    }

    // .every is the same as forEach, but it's used to check for a specific condition
    if (underScores.every((underscore, index) =>
        // so this is saying if each underscore's text content is equal to the selected word at the same index
        underscore.textContent === selectedWord[index])) {
        playSound("win.mp3")
        updateNarrative("Congratulations! You've guessed the word!");
        updateJimmyText("Yay! We won!");
        gameWon = true;
        endGame();
        return;
    }

    if (lives === 0) {
        updateNarrative(`Game Over! The word was: ${selectedWord}`);
        updateJimmyText("rip...");
        endGame();
    }
}

function updateUi() {
    updateNarrative("Hey guys its little jimmy");
    updateJimmyText("hi guys");
    makeButtons();
    makeUnderscores();
    healthBar.style.width = (lives / maxLives) * 100 + "%"
    // the text is set to an array of easy medium or hard, and it's accesing it at the value of the difficulty variable
    difficultyText.textContent = `Difficulty: ${["Easy", "Medium", "Hard"][difficulty]}`;

}

guessBtn.addEventListener("click", () => {
    submitBtn.style.display = "block";
    guessInput.style.display = "block";
    document.getElementById("typeWord").style.display = "block";
    submitBtn.classList.add("bounce-in");
    guessInput.classList.add("bounce-in");
});

submitBtn.addEventListener("click", () => {
    const guess = guessInput.value.toUpperCase();
    guessInput.value = "";

    if (guess === selectedWord) {
        underScores.forEach((underscore, index) => {
            underscore.textContent = selectedWord[index];
        });
        playSound("win.mp3")
        updateNarrative("Congratulations! You've guessed the word!");
        updateJimmyText("Yay! We won!");
        gameWon = true;
        endGame();
    } else {
        lives--;
        animateHealthBar()
        playSound("slap.mp3")
        setTimeout(() => {
            healthBar.style.width = (lives / maxLives) * 100 + "%"
        }, 200);
        flashRed();

        if (lives === 0) {
            updateNarrative(`Game Over! The word was: ${selectedWord}`);
            updateJimmyText("rip...");
        } else {
            updateNarrative(`Nope! ${lives} lives remaining`);
            updateJimmyText("dude bro stop");
            submitBtn.style.display = "none";
            guessInput.style.display = "none";
            document.getElementById("typeWord").style.display = "none";
        }
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

function resetGame() {
    stopActiveSound();
    selectedWord = "";
    underScores = [];
    guessedLetters = [];
    lives = 8;
    gameWon = false;

    document.getElementById("word-box").innerHTML = "";
    document.getElementById("letter-box").innerHTML = "";
    buttons = [];

    newGameBtn.style.display = "none";
    submitBtn.style.display = "none";
    guessInput.style.display = "none";
    guessBtn.style.display = "none";
    document.getElementById("typeWord").style.display = "none";

    updateUi();
}
newGameBtn.addEventListener("click", () => {
    resetGame();
});

difficultyBtn.addEventListener("click", () => {
    // the mod is just a way to prevent going out of bounds
    difficulty = (difficulty + 1) % wordLists.length;
    words = wordLists[difficulty];
    resetGame();
});
updateUi();