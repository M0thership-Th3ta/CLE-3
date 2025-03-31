window.addEventListener("load", init)
let form;
let money
let error
let section
let item
let totalSaldo = 0.00;
let portemonnee = JSON.parse(localStorage.getItem('portemonnee'))
let myMoney = []

function init() {
    getMoney()
    section = document.querySelector("#formSection")
    form = document.querySelector("#calculatorForm")
    money = document.querySelector("#to-pay")
    item = document.querySelector("#to-buy")
    error = section.querySelector("#error")
    saldo = document.querySelector("#totalSaldo")


    console.log(totalSaldo)
    console.log(saldo)
    saldo.textContent = "€" + totalSaldo
    form.addEventListener("submit", formHandler)
    console.log(totalSaldo)
}

function formHandler(e) {
    e.preventDefault()
    error.innerText = ""


    let cash = parseFloat(money.value.replace(",", "."))
    if (!isNaN(cash) && cash !== "" && cash === Number(cash.toFixed(2))) {
        if (cash > totalSaldo) {
            alert(`u heeft nog €${cash - totalSaldo} nodig`)
        } else {
            localStorage.setItem("saldo", parseInt(totalSaldo).toFixed(2))
            localStorage.setItem("price", cash)
            localStorage.setItem("product", item.value)
            window.location.href = "./calculator.html";
            return;
        }

    } else {
        console.log("error")
        error.innerText = "U moet een geldige prijs invoeren"
        money.value = ""
    }

}

function getMoney() {
    //  console.log(myMoney)
    for (let contains of portemonnee) {
        for (let i = 0; i < contains.aantal; i++) {
            myMoney.push(contains.waarde)
        }
    }
    totalSaldoCalc()
}


function totalSaldoCalc() {
    for (let money of myMoney) {
        totalSaldo = totalSaldo + money


    }
}