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
    document.getElementById('totaalSaldo').textContent = berekenSaldo().toFixed(2);
}

// Functie om de portemonnee op te slaan in localStorage
function opslaanInLocalStorage() {
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));
}

// Functie om de waarden van de invoervelden op te halen en toe te voegen aan de portemonnee
function verzamelInvoer() {
    return [
        {waarde: 50, aantal: parseInt(document.getElementById('biljet50').value)},
        {waarde: 20, aantal: parseInt(document.getElementById('biljet20').value)},
        {waarde: 10, aantal: parseInt(document.getElementById('biljet10').value)},
        {waarde: 5, aantal: parseInt(document.getElementById('biljet5').value)},
        {waarde: 2, aantal: parseInt(document.getElementById('munt2').value)},
        {waarde: 1, aantal: parseInt(document.getElementById('munt1').value)},
        {waarde: 0.50, aantal: parseInt(document.getElementById('munt50').value)},
        {waarde: 0.20, aantal: parseInt(document.getElementById('munt20').value)},
        {waarde: 0.10, aantal: parseInt(document.getElementById('munt10').value)},
        {waarde: 0.05, aantal: parseInt(document.getElementById('munt5').value)}
    ];
}

// Functie om de invoer toe te voegen aan de portemonnee
function voegToeAanPortemonnee() {
    const invoer = verzamelInvoer();

    invoer.forEach(item => {
        if (item.aantal > 0) {
            let bestaand = portemonnee.find(el => el.waarde === item.waarde);
            if (bestaand) {
                bestaand.aantal += item.aantal;
            } else {
                portemonnee.push(item);
            }
        }
    });

    // Sorteer de portemonnee van groot naar klein op basis van waarde
    portemonnee.sort((a, b) => b.waarde - a.waarde);

    // Update de weergave
    toonPortemonnee();

    // Sla de gegevens op in localStorage
    opslaanInLocalStorage();

    // Reset de invoervelden
    document.getElementById('portemonneeForm').reset();
}

// Functie om de portemonnee en invoervelden te resetten
function resetPortemonnee() {
    portemonnee = [];
    toonPortemonnee();
    document.getElementById('portemonneeForm').reset();
    document.getElementById('totaalSaldo').textContent = '0.00';
    localStorage.removeItem('portemonnee');
}

// Event listeners
document.getElementById('voegToeBtn').addEventListener('click', voegToeAanPortemonnee);
document.getElementById('resetBtn').addEventListener('click', resetPortemonnee);

// Toon de portemonnee bij het laden van de pagina
toonPortemonnee();