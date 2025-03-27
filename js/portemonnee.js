// Laad en bewaar portemonnee gegevens
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];

// Bereken totaal saldo
function berekenSaldo() {
    return portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Toon portemonnee in UI
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    if (lijstElement) {
        lijstElement.innerHTML = portemonnee.map(item => `<li>${item.aantal}x €${item.waarde.toFixed(2)}</li>`).join('');
    }

    const saldo = berekenSaldo().toFixed(2);
    const saldoElement = document.getElementById('totaalSaldo');
    if (saldoElement) {
        saldoElement.textContent = saldo;
        localStorage.setItem('saldo', saldo);
    }
}

// Sla portemonnee op
function opslaanInLocalStorage() {
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));
}

// Verzamel invoerwaarden
function verzamelInvoer() {
    return [
        {waarde: 50, id: 'biljet50'},
        {waarde: 20, id: 'biljet20'},
        {waarde: 10, id: 'biljet10'},
        {waarde: 5, id: 'biljet5'},
        {waarde: 2, id: 'munt2'},
        {waarde: 1, id: 'munt1'},
        {waarde: 0.50, id: 'munt0.50'},  // Aangepast van munt50 naar munt0.50
        {waarde: 0.20, id: 'munt0.20'},  // Aangepast van munt20 naar munt0.20
        {waarde: 0.10, id: 'munt0.10'},  // Aangepast van munt10 naar munt0.10
        {waarde: 0.05, id: 'munt5'}
    ].map(item => {
        const inputElement = document.getElementById(item.id);
        return {
            waarde: item.waarde,
            aantal: inputElement ? parseInt(inputElement.value) || 0 : 0
        };
    }).filter(item => !isNaN(item.aantal));
}

// Update portemonnee
function voegToeAanPortemonnee() {
    const invoer = verzamelInvoer();

    invoer.forEach(item => {
        const bestaand = portemonnee.find(el => el.waarde === item.waarde);
        if (bestaand) {
            bestaand.aantal = item.aantal;
        } else if (item.aantal > 0) {
            portemonnee.push(item);
        }
    });

    portemonnee = portemonnee.filter(item => item.aantal > 0)
        .sort((a, b) => b.waarde - a.waarde);

    toonPortemonnee();
    opslaanInLocalStorage();
}

// Vul input velden
function vulInputVelden() {
    portemonnee.forEach(item => {
        let id;
        if (item.waarde >= 1) {
            id = `biljet${item.waarde}`;
        } else {
            // Aangepast om overeen te komen met je HTML ID's
            id = `munt${item.waarde.toFixed(2).replace('0.', '0.')}`;
        }
        const element = document.getElementById(id);
        if (element) {
            element.value = item.aantal;
        }
    });
}

// Reset alles
function resetPortemonnee() {
    portemonnee = [];
    const form = document.getElementById('portemonneeForm');
    if (form) form.reset();
    localStorage.removeItem('portemonnee');
    localStorage.removeItem('saldo');
    toonPortemonnee();
}

// Event listeners
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

// Initialisatie
document.addEventListener('DOMContentLoaded', () => {
    vulInputVelden();
    toonPortemonnee();
});