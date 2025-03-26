// Laad de gegevens uit localStorage en toon ze
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];

// Functie om het totaalbedrag te berekenen
function berekenSaldo() {
    return portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Functie om de lijst van biljetten/munten bij te werken
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    lijstElement.innerText = '';

    portemonnee.forEach(item => {
        const lijstItem = document.createElement('li');
        lijstItem.textContent = `${item.aantal}x €${item.waarde.toFixed(2)}`;
        lijstElement.appendChild(lijstItem);
    });

    // Update het saldo in het DOM
    document.getElementById('totaalSaldo').textContent = berekenSaldo().toFixed(2);
    localStorage.setItem('saldo', portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0).toFixed(2))

    // Update de inputvelden met de juiste aantallen
    portemonnee.forEach(item => {
        const input = document.querySelector(`input[data-waarde="${item.waarde}"]`);
        if (input) {
            input.value = item.aantal;
        }
    });
}

// Functie om de portemonnee op te slaan in localStorage
function opslaanInLocalStorage() {
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));
}

// Functie om de waarden van de invoervelden op te halen en toe te voegen aan de portemonnee
function verzamelInvoer() {
    return [
        {waarde: 50, aantal: parseInt(document.getElementById('biljet50').value) || 0},
        {waarde: 20, aantal: parseInt(document.getElementById('biljet20').value) || 0},
        {waarde: 10, aantal: parseInt(document.getElementById('biljet10').value) || 0},
        {waarde: 5, aantal: parseInt(document.getElementById('biljet5').value) || 0},
        {waarde: 2, aantal: parseInt(document.getElementById('munt2').value) || 0},
        {waarde: 1, aantal: parseInt(document.getElementById('munt1').value) || 0},
        {waarde: 0.50, aantal: parseInt(document.getElementById('munt50').value) || 0},
        {waarde: 0.20, aantal: parseInt(document.getElementById('munt20').value) || 0},
        {waarde: 0.10, aantal: parseInt(document.getElementById('munt10').value) || 0},
        {waarde: 0.05, aantal: parseInt(document.getElementById('munt5').value) || 0}
    ].filter(item => !isNaN(item.aantal)); // Zorg dat geen NaN waarden worden opgeslagen
}

// Functie om de invoer toe te voegen aan de portemonnee
function voegToeAanPortemonnee() {
    const invoer = verzamelInvoer();

    // Vervang bestaande invoer in plaats van de array leeg te maken
    invoer.forEach(item => {
        let bestaand = portemonnee.find(el => el.waarde === item.waarde);
        if (bestaand) {
            bestaand.aantal = item.aantal; // Vervang het aantal in plaats van optellen
        } else if (item.aantal > 0) {
            portemonnee.push(item);
        }
    });

    // Sorteer de portemonnee op waarde
    portemonnee.sort((a, b) => b.waarde - a.waarde);

    // Verwijder items met aantal 0
    portemonnee = portemonnee.filter(item => item.aantal > 0);

    // Update de weergave
    toonPortemonnee();

    // Sla op in localStorage
    opslaanInLocalStorage();
}

// Functie om de portemonnee en invoervelden te resetten
function resetPortemonnee() {
    portemonnee = [];
    toonPortemonnee();
    document.getElementById('portemonneeForm').reset();
    document.getElementById('totaalSaldo').textContent = '0.00';
    localStorage.removeItem('portemonnee');
    const input = item.querySelector('input');
    input.value = 0;
}

// Functie om de event listeners voor de invoervelden in te stellen
function setupInvoerEventListeners() {
    document.querySelectorAll('.form-item').forEach(item => {
        const input = item.querySelector('input');
        const plusBtn = item.querySelector('.plus');
        const minusBtn = item.querySelector('.minus');
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                input.value = parseInt(input.value) + 1;
                voegToeAanPortemonnee();
            });
        }

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (parseInt(input.value) > 0) {
                    input.value = parseInt(input.value) - 1;
                    voegToeAanPortemonnee();
                }
            });
        }
    });
}

document.getElementById('resetBtn').addEventListener('click', resetPortemonnee);

// Instellen van event listeners voor invoervelden
setupInvoerEventListeners();

// Toon de portemonnee bij het laden van de pagina
toonPortemonnee();