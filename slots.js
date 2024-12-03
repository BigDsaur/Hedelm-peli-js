const symbols = ["🍒", "🍇", "🍊", "🍉"];
let money = 100;

document.getElementById("spinButton").addEventListener("click", () => {
    const bet = parseInt(document.getElementById("betAmount").value);

    money -= bet;
    updateMoneyDisplay();

    const slot1 = getRandomSymbol();
    const slot2 = getRandomSymbol();
    const slot3 = getRandomSymbol();
    const slot4 = getRandomSymbol();

    document.getElementById("slot1").textContent = slot1;
    document.getElementById("slot2").textContent = slot2;
    document.getElementById("slot3").textContent = slot3;
    document.getElementById("slot4").textContent = slot4;

    checkWin(slot1, slot2, slot3, slot4, bet);

    if (money < 1) disableSpinButton();
});

document.getElementById("infoButton").addEventListener("click", () => {
    document.getElementById("infoPopup").classList.remove("hidden");
});

document.getElementById("closePopupButton").addEventListener("click", () => {
    document.getElementById("infoPopup").classList.add("hidden");
});

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function checkWin(s1, s2, s3, s4, bet) {
    const result = document.getElementById("result");

    if (s1 === s2 && s2 === s3 && s3 === s4) {
        if (s1 === "🍇" || s1 === "🍉") {
            money += bet * 10;
            result.textContent = `Jackpot! Four ${s1} symbols! You won 10x your bet! 🎉`;
        } else {
            money += bet * 5;
            result.textContent = "🎉 Four of a kind! You won 5x your bet! 🎉";
        }
    } else if (s1 === s2 && s2 === s3 || s2 === s3 && s3 === s4 || s1 === s3 && s3 === s4 || s1 === s2 && s2 === s4) {
        money += bet * 3;
        result.textContent = "✨ Three of a kind! You won 3x your bet! ✨";
    } else {
        result.textContent = "Try again!";
    }
    updateMoneyDisplay();
}

function updateMoneyDisplay() {
    document.getElementById("money").textContent = money;
}

function disableSpinButton() {
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;
    spinButton.textContent = "Out of Money!";
}
