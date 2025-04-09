window.addEventListener("load", init)

// Constants for available denominations in cents (to avoid floating-point issues)
const DENOMINATIONS = {
    bill50: 5000,
    bill20: 2000,
    bill10: 1000,
    bill5: 500,
    coin2: 200,
    coin1: 100,
    coin50c: 50,
    coin20c: 20,
    coin10c: 10,
    coin5c: 5
};

let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = Number(localStorage.getItem("saldo"))
let price = Number(localStorage.getItem("price"))
let section;

function init() {
    let backButton = document.querySelector("#backbutton")
    backButton.addEventListener("click", backButtonHandler)
    section = document.querySelector("#my-money")
    let button = document.querySelector("#button")
    button.addEventListener("click", buttonHandler)

    // Initialize the calculator with the current price
    if (price > 0) {
        displayOptimalPayment(price);
    }
}

function buttonHandler(e) {
    e.preventDefault(); // Prevent default button behavior
    moneyBack();
}

function backButtonHandler(e) {
    localStorage.removeItem("wisselgeld")
    localStorage.removeItem("diffrence")
    localStorage.removeItem("wisselgeldJSON")
}

// Function to get current wallet contents
function getWalletContents() {
    let wallet = {};

    // Initialize wallet with zeros for all denominations
    for (let [denomination, value] of Object.entries(DENOMINATIONS)) {
        wallet[denomination] = 0;
    }

    // Count the number of each denomination in the wallet
    portemonnee.forEach(item => {
        for (let [denomination, value] of Object.entries(DENOMINATIONS)) {
            if (item.waarde === value / 100) {
                wallet[denomination] += item.aantal;
            }
        }
    });

    return wallet;
}

// Function to calculate wallet total
function calculateWalletTotal() {
    let total = 0;
    for (let item of portemonnee) {
        total += item.waarde * item.aantal;
    }
    return total;
}

// Function to convert wallet contents to array of values
function walletToArray(wallet) {
    let moneyArray = [];
    for (let [denomination, count] of Object.entries(wallet)) {
        for (let i = 0; i < count; i++) {
            moneyArray.push(DENOMINATIONS[denomination] / 100);
        }
    }
    return moneyArray;
}

// Function to convert array of values back to wallet format
function arrayToWalletFormat(moneyArray) {
    let result = {};
    for (let [denomination, value] of Object.entries(DENOMINATIONS)) {
        result[denomination] = 0;
    }

    moneyArray.forEach(value => {
        for (let [denomination, denomValue] of Object.entries(DENOMINATIONS)) {
            if (value === denomValue / 100) {
                result[denomination]++;
            }
        }
    });

    return result;
}

// Main calculation function
function calculateOptimalPayment(price) {
    const wallet = getWalletContents();
    const availableMoney = walletToArray(wallet);

    // Sort in descending order to prioritize larger bills
    availableMoney.sort((a, b) => b - a);

    // First find all valid single bill/coin payments
    const singlePayments = [];
    for (const money of availableMoney) {
        if (money >= price) {
            singlePayments.push([money]);
        }
    }

    // Calculate reasonable overpayment threshold - 25% of price but with a minimum of €1
    const reasonableOverpaymentThreshold = Math.max(price * 0.25, 1);

    // Find the best single bill with reasonable overpayment
    const bestSingleBill = findBestSingleBill(singlePayments, price, reasonableOverpaymentThreshold);

    // Find all valid combinations for multiple bills/coins
    let combinations = findValidCombinations(availableMoney, price);

    // Find the best combination based on minimum overpayment and fewest bills
    const bestMultiBillResult = findBestCombination(combinations, price);

    // Special case for small amounts (less than €5)
    if (price < 5) {
        if (bestMultiBillResult) {
            const multiBillOverpayment = bestMultiBillResult.change;
            if (multiBillOverpayment < 0.5) {
                return bestMultiBillResult;
            }
        }
    }

    // If there's a single bill with reasonable overpayment, use it
    if (bestSingleBill) {
        return {
            moneyToUse: bestSingleBill,
            totalPaid: bestSingleBill[0],
            change: Number((bestSingleBill[0] - price).toFixed(2)),
            success: true
        };
    }

    // Otherwise use the best multi-bill combination
    if (bestMultiBillResult) {
        return bestMultiBillResult;
    }

    // If no valid combination found
    return {
        moneyToUse: [],
        totalPaid: 0,
        change: 0,
        success: false
    };
}

// Helper function to find the best single bill with reasonable overpayment
function findBestSingleBill(singlePayments, targetPrice, reasonableOverpaymentThreshold) {
    if (singlePayments.length === 0) return null;

    let bestBill = null;
    let minOverpayment = Infinity;

    for (const payment of singlePayments) {
        const value = payment[0];
        const overpayment = value - targetPrice;

        if (overpayment <= reasonableOverpaymentThreshold && overpayment < minOverpayment) {
            minOverpayment = overpayment;
            bestBill = payment;
        }
    }

    return bestBill;
}

// Helper function to find the best combination from a list
function findBestCombination(combinations, targetPrice) {
    if (combinations.length === 0) return null;

    let bestCombination = null;
    let minDenomCount = Infinity;
    let minOverpayment = Infinity;

    for (const combo of combinations) {
        const total = combo.reduce((sum, val) => sum + val, 0);
        const overpayment = Number((total - targetPrice).toFixed(2));
        const denomCount = combo.length;

        if (overpayment < minOverpayment) {
            minOverpayment = overpayment;
            minDenomCount = denomCount;
            bestCombination = combo;
        }
        else if (overpayment === minOverpayment && denomCount < minDenomCount) {
            minDenomCount = denomCount;
            bestCombination = combo;
        }
    }

    if (bestCombination) {
        const totalPaid = bestCombination.reduce((sum, value) => sum + value, 0);
        const change = Number((totalPaid - targetPrice).toFixed(2));

        return {
            moneyToUse: bestCombination,
            totalPaid,
            change,
            success: true
        };
    }

    return null;
}

// Find all valid combinations using only available money
function findValidCombinations(values, targetPrice) {
    const denomCounts = {};
    for (const val of values) {
        denomCounts[val] = (denomCounts[val] || 0) + 1;
    }

    const uniqueValues = Object.keys(denomCounts).map(Number).sort((a, b) => b - a);
    const result = [];

    function backtrack(index, currentSum, currentCombo) {
        // If we've reached the target price exactly, add this combination
        if (Math.abs(currentSum - targetPrice) < 0.01) {
            result.push([...currentCombo]);
            return;
        }

        // If we've exceeded the target price, add this combination
        if (currentSum >= targetPrice && currentCombo.length >= 1) {
            result.push([...currentCombo]);
            return;
        }

        if (index >= uniqueValues.length) {
            return;
        }

        // Try without using this denomination
        backtrack(index + 1, currentSum, currentCombo);

        // Try using this denomination
        const denom = uniqueValues[index];
        const maxCount = denomCounts[denom];

        for (let count = 1; count <= maxCount; count++) {
            currentCombo.push(denom);
            currentSum += denom;

            // If we've reached or exceeded the target price, add this combination
            if (currentSum >= targetPrice && currentCombo.length >= 1) {
                result.push([...currentCombo]);
            }

            backtrack(index + 1, currentSum, currentCombo);

            if (currentSum >= targetPrice) {
                break;
            }
        }

        // Remove the denominations we added
        let count = 0;
        while (count < maxCount && currentCombo.length > 0 && currentCombo[currentCombo.length - 1] === denom) {
            currentCombo.pop();
            currentSum -= denom;
            count++;
        }
    }

    backtrack(0, 0, []);
    return result;
}

// Function to calculate optimal payment from wallet
function calculateOptimalPaymentFromWallet(targetAmount) {
    const result = calculateOptimalPayment(targetAmount);

    if (result.success) {
        // Convert the result to wallet format
        const walletFormat = arrayToWalletFormat(result.moneyToUse);

        // Store the results in localStorage
        localStorage.setItem("wisselgeld", result.change);
        localStorage.setItem("diffrence", result.totalPaid - targetAmount);
        localStorage.setItem("wisselgeldJSON", JSON.stringify(walletFormat));

        return {
            payment: walletFormat,
            change: result.change,
            totalPaid: result.totalPaid
        };
    }

    return {
        error: "Cannot make this payment with available money"
    };
}

// Function to handle money back
function moneyBack() {
    // Get the optimal payment result
    const result = calculateOptimalPaymentFromWallet(price);

    if (result.payment) {
        // Create array of used money items
        let usedMoneyItems = [];
        for (let [denomination, count] of Object.entries(result.payment)) {
            if (count > 0) {
                const value = DENOMINATIONS[denomination] / 100;
                usedMoneyItems.push({
                    waarde: value,
                    aantal: count
                });
            }
        }

        // Store payment information in localStorage
        const paymentInfo = {
            payment: result.payment,
            totalPaid: result.totalPaid,
            change: result.change,
            usedMoney: usedMoneyItems
        };
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

        // Store change information
        if (result.change > 0) {
            const roundedChange = roundToNearest5Cents(result.change);
            localStorage.setItem("wisselgeld", roundedChange);
            localStorage.setItem("diffrence", roundedChange);
            window.location.href = "wisselgeld.html";
        } else {
            localStorage.setItem("wisselgeld", "0");
            localStorage.setItem("diffrence", "0");
            localStorage.setItem("wisselgeldJSON", JSON.stringify([]));
            window.location.href = "confirm.html";
        }
    }
}

// Function to format money amount
function formatMoney(amount) {
    return '€' + amount.toFixed(2);
}

// Add this function after the formatMoney function
function roundToNearest5Cents(amount) {
    // Convert to cents, round to nearest 5, then convert back to euros
    return (Math.round(amount * 100 / 5) * 5 / 100).toFixed(2);
}

// Function to display optimal payment
function displayOptimalPayment(amount) {
    if (isNaN(amount) || amount <= 0) {
        section.innerHTML = '<p class="error">Please enter a valid amount</p>';
        return;
    }

    const walletTotal = calculateWalletTotal();
    if (walletTotal < amount) {
        section.innerHTML = `<p class="error">You don't have enough money in your wallet. ` +
            `Total in wallet: ${formatMoney(walletTotal)}</p>`;
        return;
    }

    const result = calculateOptimalPaymentFromWallet(amount);

    if (result.error) {
        section.innerHTML = `<p class="error">${result.error}</p>`;
        return;
    }

    // Clear the section
    section.innerHTML = '';

    // Display the payment breakdown
    for (let [denomination, count] of Object.entries(result.payment)) {
        if (count > 0) {
            let value = DENOMINATIONS[denomination] / 100;
            // Create a container for this denomination
            let denominationContainer = document.createElement("div");
            denominationContainer.classList.add("denomination-container");
            section.append(denominationContainer);

            // Create the specified number of coin/bill elements
            for (let i = 0; i < count; i++) {
                let div = document.createElement("div");
                denominationContainer.append(div);
                div.dataset.name = value;

                let image;
                if (value >= 1) {
                    image = `./img/${value}.png`;
                } else if (value < 1) {
                    image = `./img/${value.toFixed(2)}.png`;
                } else {
                    console.log("img error");
                }

                if (value > 2) {
                    div.classList.add("paper");
                } else if (value <= 2) {
                    div.classList.add("coin");
                }

                let img = document.createElement("img");
                img.src = image;
                div.append(img);

                let p = document.createElement("h3");
                p.classList.add("calcP");
                p.innerText = `€${value.toFixed(2)}`;
                div.append(p);
            }
        }
    }

    // Store the change amount for later use
    if (result.change > 0) {
        localStorage.setItem("wisselgeld", result.change.toFixed(2));
        localStorage.setItem("diffrence", result.change.toFixed(2));
    }
}

