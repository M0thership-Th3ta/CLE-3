window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = localStorage.getItem("saldo")
let price = localStorage.getItem("price")
let myMoney = [];

let section;

function init() {

    section = document.querySelector("#my-money")
    getMoney()


}

function moneyCount() {
    console.log(myMoney)

    for (let i = 0; i < myMoney.length; i++) {
        console.log(myMoney[i])
        if (myMoney[i] <= price) {
            let div = document.createElement("div")
            section.append(div)
            let p = document.createElement("p")
            p.innerText = myMoney[i]
            div.append(p)
            //    portemonnee.splice(i - 1, 1)
            price = price - myMoney[i]
        }
    }
}

function getMoney() {
    for (let contains of portemonnee) {
        for (let i = 0; i < contains.aantal; i++) {
            myMoney.push(contains.waarde)
        }
    }
    moneyCount()
}
