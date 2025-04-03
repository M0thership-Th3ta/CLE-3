window.addEventListener("load", init)

let wisselGeld = JSON.parse(localStorage.getItem('wisselgeldJSON'));
let product = localStorage.getItem('product') || " ";
let myMoney = []
let section
let date = localStorage.getItem("date-time")
let price = localStorage.getItem("price")

function init() {
    section = document.querySelector("#cash-back")
    button = document.querySelector("#button")
    button.addEventListener("click", goBackToMain)
    console.log(wisselGeld)
    loopMoney()
    goMoney()

}


function loopMoney() {
    for (let contains of wisselGeld) {
        for (let i = 0; i < contains.aantal; i++) {
            myMoney.push(contains.waarde)

        }
    }
}

function goMoney() {
    for (let value of myMoney) {
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

        let p = document.createElement("h3");
        p.classList.add("calcP")
        p.innerText = `€${value.toFixed(2)}`
        div.append(p);

    }
}

function goBackToMain() {
    pushProduct()

    localStorage.removeItem("product")
    localStorage.removeItem("diffrence")
    localStorage.removeItem("wisselgeldJSON")
    localStorage.removeItem("price")
}

function pushProduct() {
    // Haal de bestaande producten op uit localStorage of maak een lege array
    let products = JSON.parse(localStorage.getItem('products')) || [];

// Maak een nieuw productobject
    let newProduct = {
        name: `${product}`,
        price: `${price}`,
        date: `${date}`
    };

// Voeg het nieuwe product toe aan de array
    products.push(newProduct);

// Sla de bijgewerkte array op in localStorage
    localStorage.setItem("products", JSON.stringify(products));
}