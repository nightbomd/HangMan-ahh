const mediumWords = ["JIMMY", "BANANA", "COMPUTER", "PYTHON", "HANGMAN", "DEVELOPER", "JAVASCRIPT", "PROGRAMMING", "ALGORITHM", "FUNCTION"];
const easyWords = ["CAT", "DOG", "CAR", "TREE", "BOOK", "HOUSE", "BALL", "CUP", "PHONE", "TABLE"];
const hardWords = ["SOLLOQUY", "CONSEQUENTIALLY", "SHADENFREUDE", "UNCHARACTERISTICALLY", "INCOMPREHENSIBILITY", "MISUNDERSTANDING", "PHILANTHROPIC", "RECOMMENDATION", "SUBSTANTIATION"];
const wordLists = [mediumWords, easyWords, hardWords];
const healthBar = document.getElementById("bar-inner"); 

let words = wordLists[Math.floor(Math.random() * wordLists.length)];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let selectedWord = "";
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
 
    narText.textContent = "";
    nartTimeOuts.forEach(timeout => clearTimeout(timeout));
    nartTimeOuts = [];
 
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
    const audio = new Audio(file);
    audio.volume = 0.8;
    audio.play();
}
 
function endGame() {
    buttons.forEach(button => {
        button.disabled = true;
    });
    newGameBtn.style.display = "block";
    guessBtn.style.display = "none";
    submitBtn.style.display = "none";
    guessInput.style.display = "none";
    document.getElementById("typeWord").style.display = "none";
}
 
function doTheGame(letter) {
    if (gameWon || lives === 0) return;
    if (guessedLetters.includes(letter)) return;
 
    guessedLetters.push(letter);
 
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
 
    if (underScores.every((underscore, index) =>
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
 
newGameBtn.addEventListener("click", () => {
    selectedWord = "";
    underScores = [];
    guessedLetters = [];
    lives = 8;
    gameWon = false;
 
    words = wordLists[Math.floor(Math.random() * wordLists.length)];
 
    document.getElementById("word-box").innerHTML = "";
    document.getElementById("letter-box").innerHTML = "";
    buttons = [];
 
    newGameBtn.style.display = "none";
    submitBtn.style.display = "none";
    guessInput.style.display = "none";
    guessBtn.style.display = "none";
    document.getElementById("typeWord").style.display = "none";
 
    updateUi();
});
 
 
updateUi();