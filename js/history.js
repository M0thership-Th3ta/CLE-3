window.addEventListener("load", init)

//custom array, wordt later vervangen door data uit de calculator etc.
let data = [
    { name: "Laptop", price: 999.99, date: getRandomPastDate(60) },
    { name: "Phone", price: 599.49, date: getRandomPastDate(60) },
    { name: "Headphones", price: 79.99, date: getRandomPastDate(60) },
    { name: "Smartwatch", price: 199.99, date: getRandomPastDate(60) },
    { name: "Tablet", price: 349.99, date: getRandomPastDate(60) },
    { name: "Monitor", price: 249.99, date: getRandomPastDate(60) },
    { name: "Keyboard", price: 49.99, date: getRandomPastDate(60) },
    { name: "Mouse", price: 29.99, date: getRandomPastDate(60) },
    { name: "Gaming Chair", price: 199.99, date: getRandomPastDate(60) },
    { name: "External Hard Drive", price: 119.99, date: getRandomPastDate(60) },
    { name: "Webcam", price: 69.99, date: getRandomPastDate(60) },
    { name: "Microphone", price: 89.99, date: getRandomPastDate(60) },
    { name: "Speakers", price: 129.99, date: getRandomPastDate(60) },
    { name: "VR Headset", price: 399.99, date: getRandomPastDate(60) },
    { name: "Graphics Card", price: 699.99, date: getRandomPastDate(60) },
    { name: "Power Bank", price: 39.99, date: getRandomPastDate(60) },
    { name: "Wireless Charger", price: 24.99, date: getRandomPastDate(60) },
    { name: "Smart Light Bulb", price: 19.99, date: getRandomPastDate(60) },
    { name: "Bluetooth Speaker", price: 59.99, date: getRandomPastDate(60) },
    { name: "E-Reader", price: 129.99, date: getRandomPastDate(60) },
    { name: "Speakers", price: 129.99, date: getRandomPastDate(60) },
    { name: "VR Headset", price: 399.99, date: getRandomPastDate(60) },
    { name: "Graphics Card", price: 699.99, date: getRandomPastDate(60) },
    { name: "Power Bank", price: 39.99, date: getRandomPastDate(60) },
    { name: "Wireless Charger", price: 24.99, date: getRandomPastDate(60) },
    { name: "Smart Light Bulb", price: 19.99, date: getRandomPastDate(60) },
    { name: "Bluetooth Speaker", price: 59.99, date: getRandomPastDate(60) },
    { name: "E-Reader", price: 129.99, date: getRandomPastDate(60) }
];

localStorage.setItem("products", JSON.stringify(data));


function init()
{
    loadProducts()
    window.filterProducts = filterProducts;
}

//Deze functie is voor testing purposes met mijn custom array.
//Dus gaat eruit zodra ik data gebruik van de calculator etc.
function getRandomPastDate(days) {
    const today = new Date();
    const pastDate = new Date(today.setDate(today.getDate() - Math.floor(Math.random() * days)));
    return pastDate.toISOString();
}

//haalt alles op uit de localstorage en zet het in de tabel
function loadProducts() {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    storedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>${new Date(product.date).toLocaleDateString("en-GB")}</td>
                `;
        tableBody.appendChild(row);
    });
}

//function wordt elke keer als er een letter word getypt uitgevoerd.
//verbergt rows die niet aan de search query voldoen.
function filterProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const tableBody = document.getElementById("productTableBody");
    const tableRows = tableBody.getElementsByTagName("tr");

    Array.from(tableRows).forEach(row => {
        const name = row.children[0].textContent.toLowerCase();
        const price = row.children[1].textContent.toLowerCase();
        const date = row.children[2].textContent.toLowerCase();

        if (name.includes(searchInput) || price.includes(searchInput) || date.includes(searchInput)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
