window.addEventListener("load", init)

let sortDirection = 'desc'; // Default sort direction
let currentSortColumn = 'date'; // Track which column is being sorted

function init() {
    loadProducts()
    window.filterProducts = filterProducts;

    // Add click event listeners to both date and price headers
    const dateHeader = document.querySelector('th:nth-child(3)');
    const priceHeader = document.querySelector('th:nth-child(2)');

    dateHeader.addEventListener('click', () => sortByColumn('date'));
    priceHeader.addEventListener('click', () => sortByColumn('price'));

    // Add click event listener to close button
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Add click event listener to clear history button
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
}

function openModal(product) {
    const modal = document.getElementById('transactionModal');
    const modalProduct = document.getElementById('modalProduct');
    const modalPrice = document.getElementById('modalPrice');
    const modalDate = document.getElementById('modalDate');
    const modalPaidWith = document.getElementById('modalPaidWith');
    const modalChange = document.getElementById('modalChange');

    // Get transaction details from localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = transactions.find(t =>
        t.product === product.name &&
        t.price === product.price &&
        t.date === product.date
    );

    if (!transaction) {
        console.error('Transaction not found');
        return;
    }

    // Update basic transaction info
    modalProduct.textContent = transaction.product;
    modalPrice.textContent = `€${Number(transaction.price).toFixed(2)}`;
    modalDate.textContent = transaction.date;

    // Display money used to pay
    modalPaidWith.innerHTML = transaction.paidWith
        .map(item => `<li>${item.aantal}x €${Number(item.waarde).toFixed(2)}</li>`)
        .join('');

    // Display change received
    modalChange.innerHTML = transaction.change
        .map(item => `<li>${item.aantal}x €${Number(item.waarde).toFixed(2)}</li>`)
        .join('');

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'none';
}

function clearHistory() {
    if (confirm('Weet je zeker dat je de hele geschiedenis wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
        // Clear both products and transactions from localStorage
        localStorage.removeItem('products');
        localStorage.removeItem('transactions');

        // Reload the page to show empty history
        window.location.reload();
    }
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
                    <td>€${Number(product.price).toFixed(2)}</td>
                    <td>${product.date}</td>
                `;
        // Add click event listener to row
        row.addEventListener('click', () => openModal(product));
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

function sortByColumn(column) {
    const tableBody = document.getElementById("productTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));

    // If clicking a different column, reset sort direction
    if (currentSortColumn !== column) {
        sortDirection = 'desc';
    }

    // Sort the rows based on the selected column
    rows.sort((a, b) => {
        let valueA, valueB;

        if (column === 'date') {
            valueA = new Date(a.children[2].textContent);
            valueB = new Date(b.children[2].textContent);
        } else if (column === 'price') {
            valueA = parseFloat(a.children[1].textContent.replace('€', ''));
            valueB = parseFloat(b.children[1].textContent.replace('€', ''));
        }

        if (sortDirection === 'asc') {
            return valueA - valueB;
        } else {
            return valueB - valueA;
        }
    });

    // Clear the table body
    tableBody.innerHTML = '';

    // Add sorted rows back to the table
    rows.forEach(row => {
        tableBody.appendChild(row);
    });

    // Toggle sort direction
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    // Update header text to show sort direction
    const dateHeader = document.querySelector('th:nth-child(3)');
    const priceHeader = document.querySelector('th:nth-child(2)');

    // Reset both headers
    dateHeader.textContent = 'Datum';
    priceHeader.textContent = 'Prijs';

    // Update the clicked header
    if (column === 'date') {
        dateHeader.textContent = `Datum ${sortDirection === 'asc' ? '↑' : '↓'}`;
    } else {
        priceHeader.textContent = `Prijs ${sortDirection === 'asc' ? '↑' : '↓'}`;
    }

    // Update current sort column
    currentSortColumn = column;
}

function showTransactionDetails(transaction) {
    const modal = document.getElementById('transactionModal');
    const modalContent = document.getElementById('transactionModalContent');
    const modalClose = document.getElementById('transactionModalClose');

    // Format the date
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create the modal content
    modalContent.innerHTML = `
        <div class="transaction-details">
            <h2>Transactie Details</h2>
            <p><strong>Datum:</strong> ${formattedDate}</p>
            <p><strong>Prijs:</strong> €${transaction.price.toFixed(2)}</p>
            <p><strong>Betaald met:</strong></p>
            <ul>
                ${transaction.payment.usedMoney.map(item =>
        `<li>€${item.waarde.toFixed(2)} x ${item.aantal}</li>`
    ).join('')}
            </ul>
            ${transaction.payment.change > 0 ? `
                <p><strong>Wisselgeld:</strong> €${transaction.payment.change.toFixed(2)}</p>
                <p><strong>Wisselgeld uit:</strong></p>
                <ul>
                    ${transaction.change.usedMoney.map(item =>
        `<li>€${item.waarde.toFixed(2)} x ${item.aantal}</li>`
    ).join('')}
                </ul>
            ` : ''}
        </div>
    `;

    // Show the modal
    modal.style.display = 'block';
    modalClose.focus();
}
