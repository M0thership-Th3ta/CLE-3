// Laad en bewaar portemonnee gegevens
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];
let wisselgeld = JSON.parse(localStorage.getItem('wisselgeld')) || [];
let diffrence = JSON.parse(localStorage.getItem('diffrence')) || 0;

// Geldsoorten configuratie
const geldSoorten = [
    {waarde: 50, id: 'biljet50'},
    {waarde: 20, id: 'biljet20'},
    {waarde: 10, id: 'biljet10'},
    {waarde: 5, id: 'biljet5'},
    {waarde: 2, id: 'munt2'},
    {waarde: 1, id: 'munt1'},
    {waarde: 0.50, id: 'munt0.50'},
    {waarde: 0.20, id: 'munt0.20'},
    {waarde: 0.10, id: 'munt0.10'},
    {waarde: 0.05, id: 'munt0.05'}
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
        const plus = document.querySelector('.plus multi');
        if (input) {
            if (huidigTotaal + geld.waarde > diffrence) {
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

    if (totaal > diffrence) {
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

// Functie om het wisselgeld definitief naar de portemonnee te sturen en door te geven
function stopWisselgeldInPortemonnee() {
    wisselgeld.forEach(wisselItem => {
        const bestaandItem = portemonnee.find(item => item.waarde === wisselItem.waarde);
        if (bestaandItem) {
            bestaandItem.aantal += wisselItem.aantal;
        } else {
            portemonnee.push({...wisselItem});
        }
    });

    // Bewaar in localStorage
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));

    localStorage.setItem('wisselgeldJSON', JSON.stringify(wisselgeld));

    localStorage.setItem('wisselgeld', JSON.stringify(wisselgeld));
    wisselgeld = [];
    localStorage.removeItem('wisselgeld')
    toonPortemonnee();
    updateIndicators();
    alert('Wisselgeld is aan je portemonnee toegevoegd!');
    window.location.href = "index.html";
}

// Reset de wisselgeld selectie
function resetWisselgeld() {
    wisselgeld = [];
    localStorage.removeItem('wisselgeld');
    vulInputVelden();
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

// Event listeners voor knoppen
function setupEventListeners() {
    document.querySelectorAll('.form-item').forEach(item => {
        const input = item.querySelector('input');
        const plus = item.querySelector('.plus');
        const minus = item.querySelector('.minus');

        if (plus && input) {
            plus.addEventListener('click', () => {
                let waarde = parseInt(input.value) || 0;
                let geld = geldSoorten.find(g => g.id === input.id);

                if (berekenSaldo() + geld.waarde <= diffrence) {
                    input.value = waarde + 1;
                    voegToeAanWisselgeld();
                }
            });
        }

        if (minus && input) {
            minus.addEventListener('click', () => {
                let waarde = parseInt(input.value) || 0;
                if (waarde > 0) {
                    input.value = waarde - 1;
                    voegToeAanWisselgeld();
                }
            });
        }
    });

    const stopWisselgeldBtn = document.getElementById('stopWisselgeldBtn');
    if (stopWisselgeldBtn) {
        stopWisselgeldBtn.addEventListener('click', stopWisselgeldInPortemonnee);
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetWisselgeld);
    }
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
