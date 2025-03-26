window.addEventListener("load", init)
let form;
let money
let error
let section
let item
let totalSaldo = JSON.parse(localStorage.getItem('saldo')) || 0.00;


function init() {
    section = document.querySelector("#formSection")
    form = document.querySelector("#calculatorForm")
    money = document.querySelector("#to-pay")
    item = document.querySelector("#to-buy")
    error = section.querySelector("#error")
    saldo = document.querySelector("#totalSaldo")

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
            localStorage.setItem("Price", money.value)
            localStorage.setItem("Product", item.value)
            window.location.href = "./calculator.html";
            return;
        }

    } else {
        console.log("error")
        error.innerText = "U moet een geldige prijs invoeren"
        money.value = ""
    }

}