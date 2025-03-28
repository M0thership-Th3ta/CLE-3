// Laad en bewaar portemonnee gegevens
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];

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

// Bereken totaal saldo
function berekenSaldo() {
    return portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Update alle indicators
function updateIndicators() {
    geldSoorten.forEach(geld => {
        const indicator = document.getElementById(`${geld.id}-indicator`);
        if (indicator) {
            const item = portemonnee.find(item => item.waarde === geld.waarde);
            indicator.textContent = item ? item.aantal : 0;
        }
    });
}

// Toon portemonnee
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    if (lijstElement) {
        lijstElement.innerHTML = portemonnee.map(item =>
            `<li>${item.aantal}x €${item.waarde.toFixed(2)}</li>`
        ).join('');
    }

    const saldo = berekenSaldo().toFixed(2);
    const saldoElement = document.getElementById('totaalSaldo');
    if (saldoElement) {
        saldoElement.textContent = saldo;
        localStorage.setItem('saldo', saldo);
    }
    updateIndicators();
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

// Update portemonnee
function voegToeAanPortemonnee() {
    const invoer = verzamelInvoer();
    portemonnee = invoer.filter(item => item.aantal > 0)
        .sort((a, b) => b.waarde - a.waarde);
    toonPortemonnee();
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));
}

// Vul input velden
function vulInputVelden() {
    geldSoorten.forEach(geld => {
        const input = document.getElementById(geld.id);
        const indicator = document.getElementById(`${geld.id}-indicator`);
        const item = portemonnee.find(item => item.waarde === geld.waarde);

        if (input) input.value = item ? item.aantal : 0;
        if (indicator) indicator.textContent = item ? item.aantal : 0;
    });
}

// Reset alles
function resetPortemonnee() {
    portemonnee = [];
    const form = document.getElementById('portemonneeForm');
    if (form) form.reset();
    localStorage.removeItem('portemonnee');
    localStorage.removeItem('saldo');
    vulInputVelden();
    toonPortemonnee();
}

// Event listeners
function setupEventListeners() {
    document.querySelectorAll('.form-item').forEach(item => {
        const input = item.querySelector('input');
        const plus = item.querySelector('.plus');
        const minus = item.querySelector('.minus');

        if (plus && input) {
            plus.addEventListener('click', () => {
                input.value = (parseInt(input.value) || 0) + 1;
                voegToeAanPortemonnee();
            });
        }

        if (minus && input) {
            minus.addEventListener('click', () => {
                const waarde = parseInt(input.value) || 0;
                if (waarde > 0) input.value = waarde - 1;
                voegToeAanPortemonnee();
            });
        }
    });

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPortemonnee);
    }
}

// Initialisatie
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    vulInputVelden();
    toonPortemonnee();
});