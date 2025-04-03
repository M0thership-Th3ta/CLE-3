window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = Number(localStorage.getItem("saldo"))
let price = Number(localStorage.getItem("price"))
let startPrice = Number(localStorage.getItem("price"))
let diffrencePrice = Number(localStorage.getItem("price"))
let myMoney = [];
let spendMoney = [];
let section;
let calculate = 0;
let newArray = [];
let myMoneyDubeplicate = [];
let diffrence = Number(localStorage.getItem("price"))
let diffrenceCalc = 0

function init() {
    section = document.querySelector("#my-money")

    let backButton = document.querySelector("#backbutton")
    backButton.addEventListener("click", backButtonHandler)
    getMoney()
    moneyCount()
    sliceData(myMoney, spendMoney)
    let button = document.querySelector("#button")
    if (price > 0) {
        reverseMoney()
        sliceData(myMoney, spendMoney)
    }
    button.addEventListener("click", buttonHandler)
    totalSaldo = totalSaldo - price
}

function buttonHandler(e) {
    moneyBack()
}

function backButtonHandler(e) {
    localStorage.removeItem("wisselgeld")
    localStorage.removeItem("diffrence")
}

//loopt van groot naar kleinste waarde zodat we het meeste al hebben besteed
function moneyCount() {
    for (let value of myMoney) {
        if (value <= price) {
            let div = document.createElement("div");
            section.append(div);
            div.dataset.name = value;
            let image
            diffrence = 0
            diffrenceCalc = diffrenceCalc + value

            if (value >= 1) {
                image = `./img/${value}.png`
            } else if (value < 1) {
                image = `./img/${value.toFixed(2)}.png`
            } else {
                console.log("img error")
            }

            if (value > 2) {
                div.classList.add("paper")
            } else if (value <= 2) {
                div.classList.add("coin")
            }

            let img = document.createElement("img")

            img.src = image
            div.append(img)

            let p = document.createElement("h3");
            spendMoney.push(value)
            calculate = value + calculate
            price = Math.max(0, price - value).toFixed(2)
            p.classList.add("calcP")
            p.innerText = `€${value.toFixed(2)}`
            div.append(p);

            if (price <= 0.00) {

                return;
            }
        }
    }
}


function reverseMoney() {

// doet van klein naar groot want als je geld over houdt ga je dat gebruiken.
    for (let value of myMoney.reverse()) {
        if (value >= price) {
            spendMoney.push(value)


            if (calculate < startPrice && value > startPrice && startPrice >= 0) {
                section.innerText = ""
                newArray.push(value)
                sliceData(myMoneyDubeplicate, newArray)
                myMoney = myMoneyDubeplicate
                spendMoney = newArray


                startPrice = startPrice - value

            }
            diffrenceCalc = diffrenceCalc + value

            diffrence = diffrenceCalc - diffrencePrice

            let div = document.createElement("div")
            section.append(div)
            div.dataset.name = value
            let image
            if (value >= 1) {
                image = `./img/${value}.png`
            } else if (value < 1) {
                image = `./img/${value.toFixed(2)}.png`
            } else {
                console.log("img error")
            }
            if (value > 2) {
                div.classList.add("paper")
            } else if (value <= 2) {
                div.classList.add("coin")
            }
            let img = document.createElement("img")
            img.src = image
            div.append(img)
            let p = document.createElement("p")
            p.innerText = `€${value.toFixed(2)}`
            p.classList.add("calcP")
            div.append(p)
            price = price - value.toFixed(2)


            if (price <= 0.00) {
                return;
            }
        }
    }
}


// zet portomenee in een apparte array
function getMoney() {

    for (let contains of portemonnee) {
        for (let i = 0; i < contains.aantal; i++) {
            myMoney.push(contains.waarde)
            myMoneyDubeplicate.push(contains.waarde)
        }
    }

}


function sliceData(myMoney, spendMoney) {
    for (let value of spendMoney) {
        let index = myMoney.indexOf(value)
        if (index !== -1) {
            myMoney.splice(index, 1)
        }
    }
}

function moneyBack() {
    spendMoney.forEach(value => {
        let existing = portemonnee.find(item => item.waarde === value)
        if (existing) {
            existing.aantal -= 1
        } else {
            portemonnee.push({waarde: value, aantal: 1})
        }
    })
    localStorage.setItem("saldo", parseInt(totalSaldo).toFixed(2))
    localStorage.setItem("portemonnee", JSON.stringify(portemonnee))
    localStorage.setItem("diffrence", diffrence.toFixed(2))
}

