// Laad en bewaar portemonnee gegevens
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];
let wisselgeld = [];
let diffrence = Number(localStorage.getItem('diffrence')) || 0;

// Add these variables at the top of the file
let incrementInterval = null;
const INCREMENT_DELAY = 1000; // Delay before starting auto-increment (1 second)
const INCREMENT_SPEED = 100; // Speed of auto-increment in milliseconds

// Geldsoorten configuratie
const geldSoorten = [
    { waarde: 50, id: 'biljet50' },
    { waarde: 20, id: 'biljet20' },
    { waarde: 10, id: 'biljet10' },
    { waarde: 5, id: 'biljet5' },
    { waarde: 2, id: 'munt2' },
    { waarde: 1, id: 'munt1' },
    { waarde: 0.50, id: 'munt0.50' },
    { waarde: 0.20, id: 'munt0.20' },
    { waarde: 0.10, id: 'munt0.10' },
    { waarde: 0.05, id: 'munt0.05' }
];

// Bereken totaal saldo van wisselgeld
function berekenSaldo() {
    return wisselgeld.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Beperk invoer op basis van diffrence
function checkMaxInput() {
    let huidigTotaal = berekenSaldo();

    geldSoorten.forEach(geld => {
        const input = document.getElementById(geld.id);
        const plus = document.querySelector(`[id="${geld.id}"] + .plus`);
        if (input) {
            let newTotal = huidigTotaal + geld.waarde;
            // Round to 2 decimal places to avoid floating-point issues
            newTotal = Math.round(newTotal * 100) / 100;
            diffrence = Math.round(diffrence * 100) / 100;

            // Add 1 cent tolerance
            if (newTotal > diffrence + 0.01) {
                input.disabled = true;
                if (plus) plus.disabled = true;
            } else {
                input.disabled = false;
                if (plus) plus.disabled = false;
            }
        }
    });
}

// Vul de inputvelden in op basis van wisselgeld
function vulInputVelden() {
    geldSoorten.forEach(geld => {
        const input = document.getElementById(geld.id);
        if (input) {
            let item = wisselgeld.find(i => i.waarde === geld.waarde);
            input.value = item ? item.aantal : 0;
        }
    });
}

// Verzamel invoerwaarden
function verzamelInvoer() {
    return geldSoorten.map(geld => {
        const input = document.getElementById(geld.id);
        return {
            waarde: geld.waarde,
            aantal: input ? parseInt(input.value) || 0 : 0
        };
    });
}

// Update indicatoren
function updateIndicators() {
    // Update the total display
    const totalDisplay = document.getElementById('total');
    if (totalDisplay) {
        const total = berekenSaldo();
        totalDisplay.textContent = `€${total.toFixed(2)}`;
    }

    // Update the difference display
    const differenceDisplay = document.getElementById('difference');
    if (differenceDisplay) {
        const difference = Number(localStorage.getItem("diffrence")) - berekenSaldo();
        differenceDisplay.textContent = `€${difference.toFixed(2)}`;
    }

    // Update the h1 with the amount to get back
    const h1 = document.querySelector('h1');
    if (h1) {
        const difference = Number(localStorage.getItem("diffrence")) - berekenSaldo();
        h1.textContent = `Je krijgt €${difference.toFixed(2)} terug`;
    }

    // Update the confirm button state
    const confirmButton = document.getElementById('confirmButton');
    if (confirmButton) {
        const difference = Number(localStorage.getItem("diffrence")) - berekenSaldo();
        if (Math.abs(difference) < 0.01) {
            confirmButton.disabled = false;
            confirmButton.classList.remove('disabled');
        } else {
            confirmButton.disabled = true;
            confirmButton.classList.add('disabled');
        }
    }

    geldSoorten.forEach(geld => {
        const indicator = document.getElementById(`${geld.id}-indicator`);
        if (indicator) {
            const item = wisselgeld.find(item => item.waarde === geld.waarde);
            indicator.textContent = item ? item.aantal : 0;
        }
    });
}

// Update wisselgeld selectie in localStorage
function voegToeAanWisselgeld() {
    const invoer = verzamelInvoer();
    let totaal = invoer.reduce((sum, item) => sum + (item.waarde * item.aantal), 0);

    // Round to 2 decimal places to avoid floating-point issues
    totaal = Math.round(totaal * 100) / 100;
    diffrence = Math.round(diffrence * 100) / 100;

    // Add 1 cent tolerance
    if (totaal > diffrence + 0.01) {
        alert(`Je kunt niet meer dan €${diffrence.toFixed(2)} invoeren!`);
        return;
    }

    // Update wisselgeld in localStorage
    wisselgeld = invoer.filter(item => item.aantal > 0);
    localStorage.setItem('wisselgeld', JSON.stringify(wisselgeld));

    toonPortemonnee();
    checkMaxInput();
    updateIndicators();
}

// Add these functions before setupEventListeners
function startAutoIncrement(button, input, increment) {
    // Clear any existing interval
    if (incrementInterval) {
        clearInterval(incrementInterval);
    }

    // Start auto-increment after delay
    let timeoutId = setTimeout(() => {
        // Set wasLongPress when auto-increment starts
        button.dataset.wasLongPress = 'true';
        incrementInterval = setInterval(() => {
            let waarde = parseInt(input.value) || 0;
            let geld = geldSoorten.find(g => g.id === input.id);

            let newTotal = berekenSaldo() + geld.waarde;
            // Round to 2 decimal places to avoid floating-point issues
            newTotal = Math.round(newTotal * 100) / 100;
            diffrence = Math.round(diffrence * 100) / 100;

            // Add 1 cent tolerance
            if (newTotal <= diffrence + 0.01) {
                input.value = waarde + increment;
                voegToeAanWisselgeld();
            } else {
                stopAutoIncrement(button);
            }
        }, INCREMENT_SPEED);
    }, INCREMENT_DELAY);

    // Store the timeout ID to clear it if mouseup/touchend happens before delay
    button.dataset.timeoutId = timeoutId;
}

function stopAutoIncrement(button) {
    // Clear the timeout if it exists
    if (button.dataset.timeoutId) {
        clearTimeout(parseInt(button.dataset.timeoutId));
        delete button.dataset.timeoutId;
    }
    // Clear the interval
    if (incrementInterval) {
        clearInterval(incrementInterval);
        incrementInterval = null;
    }
}

// Add these functions at the top of the file after the variables
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const diffrenceSpan = document.getElementById('diffrence');
    if (modalOverlay && diffrenceSpan) {
        const currentTotal = berekenSaldo();
        const remainingDiff = Number(localStorage.getItem("diffrence")) - currentTotal;
        diffrenceSpan.textContent = remainingDiff.toFixed(2);
        modalOverlay.style.display = 'flex';
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'none';
    }
}

// Modify the setupEventListeners function
function setupEventListeners() {
    document.querySelectorAll('.form-item').forEach(item => {
        const input = item.querySelector('input');
        const plus = item.querySelector('.plus');
        const minus = item.querySelector('.minus');

        if (plus && input) {
            // Mouse events for desktop
            plus.addEventListener('mousedown', (e) => {
                e.preventDefault();
                plus.dataset.wasLongPress = 'false';
                plus.dataset.pressStartTime = Date.now();
                startAutoIncrement(plus, input, 1);
            });

            plus.addEventListener('mouseup', (e) => {
                e.preventDefault();
                stopAutoIncrement(plus);
                if (plus.dataset.wasLongPress !== 'true' &&
                    Date.now() - parseInt(plus.dataset.pressStartTime) < INCREMENT_DELAY) {
                    let waarde = parseInt(input.value) || 0;
                    let geld = geldSoorten.find(g => g.id === input.id);

                    let newTotal = berekenSaldo() + geld.waarde;
                    // Round to 2 decimal places to avoid floating-point issues
                    newTotal = Math.round(newTotal * 100) / 100;
                    diffrence = Math.round(diffrence * 100) / 100;

                    // Add 1 cent tolerance
                    if (newTotal <= diffrence + 0.01) {
                        input.value = waarde + 1;
                        voegToeAanWisselgeld();
                    }
                }
            });

            plus.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                stopAutoIncrement(plus);
            });

            // Touch events for mobile
            plus.addEventListener('touchstart', (e) => {
                e.preventDefault();
                plus.dataset.wasLongPress = 'false';
                plus.dataset.pressStartTime = Date.now();
                startAutoIncrement(plus, input, 1);
            });

            plus.addEventListener('touchend', (e) => {
                e.preventDefault();
                stopAutoIncrement(plus);
                if (plus.dataset.wasLongPress !== 'true' &&
                    Date.now() - parseInt(plus.dataset.pressStartTime) < INCREMENT_DELAY) {
                    let waarde = parseInt(input.value) || 0;
                    let geld = geldSoorten.find(g => g.id === input.id);

                    let newTotal = berekenSaldo() + geld.waarde;
                    // Round to 2 decimal places to avoid floating-point issues
                    newTotal = Math.round(newTotal * 100) / 100;
                    diffrence = Math.round(diffrence * 100) / 100;

                    // Add 1 cent tolerance
                    if (newTotal <= diffrence + 0.01) {
                        input.value = waarde + 1;
                        voegToeAanWisselgeld();
                    }
                }
            });

            plus.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                stopAutoIncrement(plus);
            });
        }

        if (minus && input) {
            // Mouse events for desktop
            minus.addEventListener('mousedown', (e) => {
                e.preventDefault();
                minus.dataset.wasLongPress = 'false';
                minus.dataset.pressStartTime = Date.now();
                startAutoIncrement(minus, input, -1);
            });

            minus.addEventListener('mouseup', (e) => {
                e.preventDefault();
                stopAutoIncrement(minus);
                if (minus.dataset.wasLongPress !== 'true' &&
                    Date.now() - parseInt(minus.dataset.pressStartTime) < INCREMENT_DELAY) {
                    let waarde = parseInt(input.value) || 0;
                    if (waarde > 0) {
                        input.value = waarde - 1;
                        voegToeAanWisselgeld();
                    }
                }
            });

            minus.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                stopAutoIncrement(minus);
            });

            // Touch events for mobile
            minus.addEventListener('touchstart', (e) => {
                e.preventDefault();
                minus.dataset.wasLongPress = 'false';
                minus.dataset.pressStartTime = Date.now();
                startAutoIncrement(minus, input, -1);
            });

            minus.addEventListener('touchend', (e) => {
                e.preventDefault();
                stopAutoIncrement(minus);
                if (minus.dataset.wasLongPress !== 'true' &&
                    Date.now() - parseInt(minus.dataset.pressStartTime) < INCREMENT_DELAY) {
                    let waarde = parseInt(input.value) || 0;
                    if (waarde > 0) {
                        input.value = waarde - 1;
                        voegToeAanWisselgeld();
                    }
                }
            });

            minus.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                stopAutoIncrement(minus);
            });
        }
    });

    const stopWisselgeldBtn = document.getElementById('stopWisselgeldBtn');
    if (stopWisselgeldBtn) {
        stopWisselgeldBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            stopWisselgeldInPortemonnee();
        });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetWisselgeld);
    }

    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
}

// Functie om het wisselgeld definitief naar de portemonnee te sturen en door te geven
function stopWisselgeldInPortemonnee() {
    // Calculate current total
    let totaal = berekenSaldo();
    // Round to 2 decimal places to avoid floating-point issues
    totaal = Math.round(totaal * 100) / 100;
    diffrence = Math.round(diffrence * 100) / 100;

    // Check if total matches the required change amount (with 1 cent tolerance)
    if (Math.abs(totaal - diffrence) > 0.01) {
        openModal();
        return;
    }

    // Store change information in localStorage
    localStorage.setItem('wisselgeldJSON', JSON.stringify(wisselgeld));

    // Clear temporary wisselgeld data
    wisselgeld = [];
    localStorage.removeItem('wisselgeld');

    // Update display
    toonPortemonnee();
    updateIndicators();

    // Redirect to confirm page
    window.location.href = "confirm.html";
}

// Reset de wisselgeld selectie
function resetWisselgeld() {
    wisselgeld = [];
    localStorage.removeItem('wisselgeld');

    // Re-enable all input fields and plus buttons
    geldSoorten.forEach(geld => {
        const input = document.getElementById(geld.id);
        const plus = document.querySelector(`[id="${geld.id}"] + .plus`);
        if (input) {
            input.disabled = false;
            input.value = 0;
        }
        if (plus) {
            plus.disabled = false;
        }
    });

    toonPortemonnee();
    updateIndicators();
}

// Toon portemonnee en saldo
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    if (lijstElement) {
        lijstElement.innerHTML = wisselgeld.map(item =>
            `<li>${item.aantal}x €${item.waarde.toFixed(2)}</li>`
        ).join('');
    }

    const saldoElement = document.getElementById('totaalSaldo');
    if (saldoElement) {
        saldoElement.textContent = berekenSaldo().toFixed(2);
    }

    updateIndicators();
}

// Initialisatie
document.addEventListener('DOMContentLoaded', () => {
    if (diffrence === 0) {
        window.location.href = "index.html";
    }

    setupEventListeners();
    vulInputVelden();
    toonPortemonnee();
    checkMaxInput();
});
