window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let section

function init() {
    section = document.querySelector("#my-money")


    moneyCount()
}

function moneyCount() {
    for (let items of portemonnee) {
        // console.log(items.waarde)
        //  console.log(items.aantal)

        for (let i = 0; i < items.aantal; i++) {
            console.log(items.waarde)
            let div = document.createElement("div")
            section.append(div)
            let p = document.createElement("p")
            p.innerText = items.waarde
            div.append(p)

        }
    }
}