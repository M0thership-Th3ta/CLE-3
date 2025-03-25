window.addEventListener("load", init)
let form;
let field

function init() {
    form = document.querySelector("#calculatorForm")
    field = document.querySelector("#to-pay")
    form.addEventListener("submit", formHandler)
}

function formHandler(e) {
    e.preventDefault()
    let cash = parseFloat(field.value.replace(",", "."))
    console.log(cash)
    if (!isNaN(cash)) {
        console.log("YES!")
    } else {

    }

}