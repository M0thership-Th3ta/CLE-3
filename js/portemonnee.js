// Laad en bewaar portemonnee gegevens
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];

// Bereken totaal saldo
function berekenSaldo() {
    return portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Toon portemonnee in UI
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    lijstElement.innerHTML = portemonnee.map(item => `<li>${item.aantal}x €${item.waarde.toFixed(2)}</li>`).join('');

    const saldo = berekenSaldo().toFixed(2);
    document.getElementById('totaalSaldo').textContent = saldo;
    localStorage.setItem('saldo', saldo);
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
        {waarde: 0.50, id: 'munt0.50'},
        {waarde: 0.20, id: 'munt0.20'},
        {waarde: 0.10, id: 'munt0.10'},
        {waarde: 0.05, id: 'munt0.05'}
    ].map(item => ({
        waarde: item.waarde,
        aantal: parseInt(document.getElementById(item.id).value) || 0
    })).filter(item => !isNaN(item.aantal));
}

// Update portemonnee
function voegToeAanPortemonnee() {
    const invoer = verzamelInvoer();

    invoer.forEach(item => {
        const bestaand = portemonnee.find(el => el.waarde === item.waarde);
        bestaand ? bestaand.aantal = item.aantal : item.aantal > 0 && portemonnee.push(item);
    });

    portemonnee = portemonnee.filter(item => item.aantal > 0)
        .sort((a, b) => b.waarde - a.waarde);

    toonPortemonnee();
    opslaanInLocalStorage();
}

// Vul input velden
function vulInputVelden() {
    portemonnee.forEach(item => {
        const id = ['50', '20', '10', '5', '2', '1', '0.50', '0.20', '0.10', '0.05'].includes(item.waarde.toString())
            ? `biljet${item.waarde}`.replace('biljet0.', 'munt')
            : `munt${item.waarde}`;
        document.getElementById(id) && (document.getElementById(id).value = item.aantal);
    });
}

// Reset alles
function resetPortemonnee() {
    portemonnee = [];
    document.getElementById('portemonneeForm').reset();
    localStorage.removeItem('portemonnee');
    localStorage.removeItem('saldo');
    toonPortemonnee();
}

// Event listeners
document.querySelectorAll('.form-item').forEach(item => {
    const input = item.querySelector('input');
    item.querySelector('.plus')?.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        voegToeAanPortemonnee();
    });
    item.querySelector('.minus')?.addEventListener('click', () => {
        input.value > 0 && (input.value = parseInt(input.value) - 1);
        voegToeAanPortemonnee();
    });
});

document.getElementById('resetBtn').addEventListener('click', resetPortemonnee);

// Initialisatie
document.addEventListener('DOMContentLoaded', () => {
    vulInputVelden();
    toonPortemonnee();
});