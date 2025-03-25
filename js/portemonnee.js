// Functie om het totaalbedrag te berekenen
function berekenSaldo() {
    return portemonnee.reduce((totaal, item) => totaal + item.waarde * item.aantal, 0);
}

// Functie om de lijst van biljetten/munten bij te werken
function toonPortemonnee() {
    const lijstElement = document.getElementById('portemonneeLijst');
    lijstElement.innerHTML = ''; // Leeg de lijst
    portemonnee.forEach(item => {
        const lijstItem = document.createElement('li');
        lijstItem.textContent = `${item.aantal}x €${item.waarde.toFixed(2)}`;
        lijstElement.appendChild(lijstItem);
    });
    document.getElementById('totaalSaldo').textContent = berekenSaldo().toFixed(2);
}

// Laad de gegevens uit localStorage en toon ze
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || [];

// Sorteer de portemonnee van groot naar klein op basis van waarde
portemonnee.sort((a, b) => b.waarde - a.waarde);
toonPortemonnee();

// Functie om de gegevens op te slaan in localStorage
function opslaanInLocalStorage() {
    localStorage.setItem('portemonnee', JSON.stringify(portemonnee));
}

// Functie om de gegevens op te slaan wanneer de "Opslaan" knop wordt ingedrukt
document.getElementById('voegToeBtn').addEventListener('click', function () {
    // Verkrijg alle ingevoerde waarden
    const invoer = [
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

    // Voeg de waarden toe aan de portemonnee array
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
});

// Functie om de portemonnee en invoervelden te resetten
document.getElementById('resetBtn').addEventListener('click', function () {
    // Reset de array en de weergave
    portemonnee = [];
    toonPortemonnee();
    // Reset de invoervelden
    document.getElementById('portemonneeForm').reset();
    // Zet het totaal op 0
    document.getElementById('totaalSaldo').textContent = '0.00';

    // Verwijder de gegevens uit localStorage
    localStorage.removeItem('portemonnee');
});