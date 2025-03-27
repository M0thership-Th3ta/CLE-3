window.addEventListener("load", init);

//globals
let htmlList
let clearButton

let list = ["teehee", "hoohoo"];

function init(){
    htmlList = document.querySelector("#boodschappenlijst")
    clearButton = document.querySelector("#clear-button")

    clearButton.addEventListener("click", clearList)

    listItems()
}

function listItems(){
    for (let item of list){
        console.log(item)
        let li = document.createElement("li")
        li.textContent = item
        htmlList.appendChild(li)
    }
}

function clearList(){
    while(htmlList.hasChildNodes()){
        htmlList.removeChild(htmlList.firstChild)
    }
    list = []
}