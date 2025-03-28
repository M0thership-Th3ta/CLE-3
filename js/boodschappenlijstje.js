window.addEventListener("load", init);

//globale variabelen
let inputButton
let htmlList
let clearButton

let list = [];

//Een functie die de initializatie van de pagina regelt
function init(){
    //De variabelen initialiseren
    inputButton = document.querySelector("#input")
    htmlList = document.querySelector("#boodschappenlijst")
    clearButton = document.querySelector("#clear-button")

    //Event listeners
    inputButton.addEventListener("click", addItems)
    clearButton.addEventListener("click", clearList)

    //De boodschappenlijst weergeven
    listItems()
}

//Een functie die de boodschappenlijst weergeeft
function listItems(){
    for (let item of list){
        console.log(item)
        let li = document.createElement("li")
        li.textContent = item
        htmlList.appendChild(li)
    }
}

//Een functie die een item toevoegt aan de boodschappenlijst
function addItems(){
    let input = document.querySelector("#boodschap")
    let li = document.createElement("li")
    li.textContent = input.value
    htmlList.appendChild(li)
    list.push(input.value)
    input.value = ""
}

//Een functie die de boodschappenlijst leegt
function clearList(){
    while(htmlList.hasChildNodes()){
        htmlList.removeChild(htmlList.firstChild)
    }
    list = []
}