window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = localStorage.getItem("saldo")
let price = localStorage.getItem("price")
let section

function init() {
    section = document.querySelector("#my-money")
    console.log(totalSaldo)
    console.log(price)

    moneyCount()
}

function moneyCount() {
    for (let items of portemonnee) {
        for (let i = 0; i < items.aantal; i++) {
            if (items.waarde <= price) {
                let div = document.createElement("div")
                section.append(div)
                let p = document.createElement("p")
                p.innerText = items.waarde
                div.append(p)
                price = price - items.waarde
                console.log(price)
            }
        }
    }
}