window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = localStorage.getItem("saldo")
let price = localStorage.getItem("price")
let startPrice = parseInt(localStorage.getItem("price"))
let myMoney = [];
let spendMoney = [];
let section;
let calculate = 0;
let newArray = [];
let myMoneyDubeplicate = [];

function init() {
    section = document.querySelector("#my-money")

    getMoney()
    moneyCount()
    sliceData(myMoney, spendMoney)
    if (price > 0) {
        reverseMoney()
        sliceData(myMoney, spendMoney)
    }
    totalSaldo = totalSaldo - price
    moneyBack()
}

//loopt van groot naar kleinste waarde zodat we het meeste al hebben besteed
function moneyCount() {
    for (let value of myMoney) {
        if (value <= price) {
            let div = document.createElement("div");
            section.append(div);
            div.dataset.name = value;
            let p = document.createElement("p");
            spendMoney.push(value)
            calculate = value + calculate
            console.log("Using:", value);
            price = Math.max(0, price - value).toFixed(2)
            console.log("Remaining price:", price);
            p.innerText = value;
            div.append(p);

            if (price <= 0.00) {
                console.log(value, "is nul")
                return;
            }
        }
    }
}

/*

Hier sliced het

 */

function reverseMoney() {
    console.log("it does")
// doet van klein naar groot want als je geld over houdt ga je dat gebruiken.
    for (let value of myMoney.reverse()) {
        if (value >= price) {
            console.log(startPrice)
            spendMoney.push(value)
            if (calculate < startPrice && value > startPrice && startPrice >= 0) {

                section.innerText = ""

                newArray.push(value)


                sliceData(myMoneyDubeplicate, newArray)
                myMoney = myMoneyDubeplicate
                spendMoney = newArray
                console.log(spendMoney, "HELPs")
                startPrice = startPrice - value
                console.log(startPrice, "HHHHHEEEELPPT")

            }
            let div = document.createElement("div")
            section.append(div)
            div.dataset.name = value

            let p = document.createElement("p")
          

            p.innerText = value
            div.append(p)

            console.log("Using:", value, "reverse");
            price = Math.max(0, price - value).toFixed(2)
            console.log("Remaining price:", price, "reverse");


            if (price <= 0.00) {
                console.log(price, "is nul")
                return;
            }
        }
    }
}


// zet portomenee in een apparte array
function getMoney() {
    //  console.log(myMoney)
    for (let contains of portemonnee) {
        for (let i = 0; i < contains.aantal; i++) {
            myMoney.push(contains.waarde)
            myMoneyDubeplicate.push(contains.waarde)
        }
    }

}


function sliceData(myMoney, spendMoney) {

    for (let value of spendMoney) {
        let index = myMoney.indexOf(value);
        if (index !== -1) {
            myMoney.splice(index, 1);
        }
    }
}

function moneyBack() {
    console.log("Returning money...");


    // Restore spent money correctly
    spendMoney.forEach(value => {
        let existing = portemonnee.find(item => item.waarde === value);
        if (existing) {
            existing.aantal -= 1; // Increment count if value exists
        } else {
            portemonnee.push({waarde: value, aantal: 1}); // Add new value if not found
        }
    });
    localStorage.setItem("saldo", parseInt(totalSaldo).toFixed(2))
    localStorage.setItem("portemonnee", JSON.stringify(portemonnee));
}
