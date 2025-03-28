window.addEventListener("load", init)
let portemonnee = JSON.parse(localStorage.getItem('portemonnee')) || []
let totalSaldo = localStorage.getItem("saldo")
let price = localStorage.getItem("price")
let myMoney = [];
let spendMoney = [];
let section;


function init() {
    section = document.querySelector("#my-money")

    getMoney()
    moneyCount()
    sliceData(myMoney, spendMoney)
    console.log(myMoney)
    reverseMoney()
    //  sliceData(myMoney, spendMoney)

}

// loopt van groot naar kleinste waarde zodat we het meeste al hebben besteed
function moneyCount() {
    for (let value of myMoney) {
        if (value <= price) {
            let div = document.createElement("div");
            section.append(div);
            div.dataset.name = value;
            let p = document.createElement("p");
            spendMoney.push(value)

            //   console.log(value)
            price -= value;
            //     console.log(price)
            p.innerText = value;
            div.append(p);

            if (price <= 0.05) {
                console.log(value, "is nul")
                return;
            }
        }
    }
    //  console.log(myMoney)


}


function reverseMoney() {
// doet van klein naar groot want als je geld over houdt ga je dat gebruiken.
    for (let value of myMoney.reverse()) {
        if (value <= price) {


            let div = document.createElement("div")
            section.append(div)
            div.dataset.name = value

            let p = document.createElement("p")
            spendMoney.push(value)

            p.innerText = value
            div.append(p)
            //   console.log(value)
            price -= value
            console.log(price)
            if (price <= 0.05) {
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
        }
    }
    moneyCount()
}


function sliceData(myMoney, spendMoney) {

    for (let value of spendMoney) {
        let index = myMoney.indexOf(value);
        if (index !== -1) {
            myMoney.splice(index, 1);
        }
    }
}




