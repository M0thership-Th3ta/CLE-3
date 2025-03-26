window.addEventListener("load", init)
let form;
let money
let error
let section
let item

function init() {
    section = document.querySelector("#formSection")
    form = document.querySelector("#calculatorForm")
    money = document.querySelector("#to-pay")
    item = document.querySelector("#to-buy")
    error = section.querySelector("#error")
    form.addEventListener("submit", formHandler)
}

function formHandler(e) {
    e.preventDefault()
    error.innerText = ""


    let cash = parseFloat(money.value.replace(",", "."))
    let roundedcash = Number(cash.toFixed(2))

    console.log(roundedcash)


    if (!isNaN(cash) && cash !== "") {

        console.log(item.value)
    } else {
        console.log("error")
        error.innerText = "U moet een prijs invoeren"
    }

}