const symbols = ["🍒", "🍇", "🍊", "🍉"];
let money = 100;
let lockedSlots = { 1: false, 2: false, 3: false, 4: false };
let canLock = true; // Controls if locking is allowed

document.getElementById("spinButton").addEventListener("click", () => {
    const bet = parseInt(document.getElementById("betAmount").value);

    money -= bet;
    updateMoneyDisplay();

    for (let i = 1; i <= 4; i++) {
        if (!lockedSlots[i]) {
            document.getElementById(`slot${i}`).textContent = getRandomSymbol();
        }
    }

    const win = checkWin(
        document.getElementById("slot1").textContent,
        document.getElementById("slot2").textContent,
        document.getElementById("slot3").textContent,
        document.getElementById("slot4").textContent,
        bet
    );

    if (win) {
        resetLocksAfterWin();
    } else {
        resetLocksAfterSpin(); // Reset locks and buttons for the next roll
    }

    if (money < 1) disableSpinButton();
});

document.querySelectorAll(".lockButton").forEach((button) => {
    button.addEventListener("click", () => {
        if (!canLock || button.disabled) {
            return; // Do nothing if locking is not allowed or button is disabled
        }

        const slotNum = button.getAttribute("data-slot");
        lockedSlots[slotNum] = !lockedSlots[slotNum];

        button.classList.toggle("locked", lockedSlots[slotNum]);
        button.textContent = lockedSlots[slotNum] ? "Unlock" : "Lock";

        if (lockedSlots[slotNum]) {
            button.disabled = true; // Disable button after locking
        }
    });
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
    let win = false;

    if (s1 === s2 && s2 === s3 && s3 === s4) {
        win = true;
        if (s1 === "🍇" || s1 === "🍉") {
            money += bet * 10;
            result.textContent = `🍇🍉 Jackpot! Four ${s1} symbols! You won 10x your bet! 🎉`;
        } else {
            money += bet * 5;
            result.textContent = "🎉 Four of a kind! You won 5x your bet! 🎉";
        }
    } else if (
        s1 === s2 && s2 === s3 ||
        s2 === s3 && s3 === s4 ||
        s1 === s3 && s3 === s4 ||
        s1 === s2 && s2 === s4
    ) {
        win = true;
        money += bet * 3;
        result.textContent = "✨ Three of a kind! You won 3x your bet! ✨";
    } else {
        result.textContent = "Try again!";
    }

    updateMoneyDisplay();
    return win;
}

function resetLocksAfterWin() {
    // Prevent further locking if the player wins
    canLock = false;

    // Reset locks visually and logically
    for (let i = 1; i <= 4; i++) {
        lockedSlots[i] = false;
        const lockButton = document.querySelector(`.lockButton[data-slot="${i}"]`);
        lockButton.disabled = true; // Disable lock button after winning
        lockButton.classList.remove("locked");
        lockButton.textContent = "Lock";
    }
}

function resetLocksAfterSpin() {
    // Allow locking for the next spin and reset locks
    canLock = true;

    for (let i = 1; i <= 4; i++) {
        lockedSlots[i] = false;
        const lockButton = document.querySelector(`.lockButton[data-slot="${i}"]`);
        lockButton.disabled = false; // Re-enable lock button for the next roll
        lockButton.classList.remove("locked");
        lockButton.textContent = "Lock";
    }
}

function updateMoneyDisplay() {
    document.getElementById("money").textContent = money;
}

function disableSpinButton() {
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;
    spinButton.textContent = "Out of Money!";
}
