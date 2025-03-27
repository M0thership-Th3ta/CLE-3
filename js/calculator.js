window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = localStorage.getItem("saldo")
let price = localStorage.getItem("price")
let myMoney = [];

let section;

function init() {

    section = document.querySelector("#my-money")
    getMoney()
    console.log(myMoney)

}

function moneyCount() {
    console.log(myMoney)

    for (let i = 0; i < myMoney.length; i++) {
        if (myMoney[i] <= price) {
            let div = document.createElement("div")
            section.append(div)
            let p = document.createElement("p")
            price = price - myMoney[i]
            p.innerText = myMoney[i]
            div.append(p)
            //   myMoney.splice(i, 1)
            console.log(myMoney)

            if (price <= 0) {
                console.log(price)
                return;

            }
        }
    }

    for (let i = myMoney.length - 1; i >= 0; i--) {
        console.log("test")

        if (myMoney[i] > price) {
            let div = document.createElement("div")
            section.append(div)
            let p = document.createElement("p")
            p.innerText = myMoney[i]
            div.append(p)
            price = price - myMoney[i]
            //   myMoney.splice(i, 1)


            console.log(price)

            if (price <= 0) {
                console.log(price)
                return;

            }
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
