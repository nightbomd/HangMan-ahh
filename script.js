function updateUi() {
    window.addEventListener("load", () => {
        updateNarrative("Hey guys its little jimmy");
        makeButtons();
    });
}

function makeButtons() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letterBox = document.getElementById("letter-box");

    for (let i = 0; i < alphabet.length; i++) {
        const button = document.createElement("button");
        button.textContent = alphabet[i];
        button.classList.add("letter-button");
        letterBox.appendChild(button);
    }
}

function updateNarrative(text) {
    const narText = document.getElementById("narText");
  

    narText.textContent = "";

    const letters = text.split("");

    letters.forEach((char, index) => { 
        setTimeout(() => {
            narText.textContent += char;
        }, index * 50);
    });
}
function updateJimmyText(text) {
    const narText = document.getElementById("narText");
    narText.textContent = text;
}

updateUi();