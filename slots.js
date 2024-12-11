const symbols = ["🍒", "🍇", "🍊", "🍉", "🍆", "🍓"];
let money = 100;
let lockedSlots = { 1: false, 2: false, 3: false, 4: false };
let canLock = true; // Can lock initially
let mustRollAll = true; // Tracks if all slots must roll

document.getElementById("spinButton").addEventListener("click", () => {
    const bet = parseInt(document.getElementById("betAmount").value);

    if (money < bet) {
        alert("Not enough money to place that bet!");
        disableSpinButton();
        return;
    }

    // Deduct bet
    money -= bet;
    updateMoneyDisplay();

    // Roll the slots
    for (let i = 1; i <= 4; i++) {
        if (!lockedSlots[i]) {
            document.getElementById(`slot${i}`).textContent = getRandomSymbol();
        }
    }

    // Check if there's a win
    const win = checkWin(
        document.getElementById("slot1").textContent,
        document.getElementById("slot2").textContent,
        document.getElementById("slot3").textContent,
        document.getElementById("slot4").textContent,
        bet
    );

    if (win) {
        resetLocksAfterSpin(); // Reset locks and disable after a win
    } else if (!anySlotsLocked()) {
        enableLocks(); // Allow locking only if no slots were locked in the previous spin
    } else {
        resetLocksAfterSpin(); // Reset locks and disable after losing with locks
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
/*         button.textContent = lockedSlots[slotNum] ? "Unlock" : "Lock"; */
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
        (s1 === s2 && s2 === s3) ||
        (s2 === s3 && s3 === s4) ||
        (s1 === s3 && s3 === s4) ||
        (s1 === s2 && s2 === s4)
    ) {
        win = true;

        // Special check for three grapes or three watermelons
        if (
            (s1 === s2 && s2 === s3 && (s1 === "🍇" || s1 === "🍉")) ||
            (s2 === s3 && s3 === s4 && (s2 === "🍇" || s2 === "🍉")) ||
            (s1 === s3 && s3 === s4 && (s1 === "🍇" || s1 === "🍉")) ||
            (s1 === s2 && s2 === s4 && (s1 === "🍇" || s1 === "🍉"))
        ) {
            money += bet * 5;
            result.textContent = `✨ Three ${s1} symbols (special fruit)! You won 5x your bet! ✨`;
        } else {
            money += bet * 3;
            result.textContent = "✨ Three of a kind! You won 3x your bet! ✨";
        }
    } else {
        result.textContent = "Try again!";
    }

    updateMoneyDisplay();
    return win;
}


function resetLocksAfterSpin() {
    // Disable all locks after a spin (winning or losing)
    canLock = false;

    for (let i = 1; i <= 4; i++) {
        lockedSlots[i] = false;
        const lockButton = document.querySelector(`.lockButton[data-slot="${i}"]`);
        lockButton.disabled = true;
        lockButton.textContent = "Lock";
        lockButton.classList.remove("locked");
    }
}

function enableLocks() {
    // Enable all lock buttons
    canLock = true;

    for (let i = 1; i <= 4; i++) {
        const lockButton = document.querySelector(`.lockButton[data-slot="${i}"]`);
        lockButton.disabled = false;
        lockButton.textContent = "Lock";
        lockButton.classList.remove("locked");
    }
}

function anySlotsLocked() {
    // Check if any slots are currently locked
    return Object.values(lockedSlots).some((locked) => locked);
}

function updateMoneyDisplay() {
    document.getElementById("money").textContent = money;
}

function disableSpinButton() {
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;
    spinButton.textContent = "OUT";
}

// Randomize slots when the page loads
function initializeSlots() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`slot${i}`).textContent = getRandomSymbol();
    }
}

// Call the function to randomize slots at the start
initializeSlots();
