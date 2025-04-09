window.addEventListener("load", init);

//globals
let screenReaderButton
let speech

function init(){
    //De knop aanmaken
    makeSpeechButton()

    //De variabelen initialiseren
    screenReaderButton = document.querySelector("#screen-reader-button")

    //Event listeners
    screenReaderButton.addEventListener("click", screenReader)
}

function screenReader(){
    cancelSpeech()
    readAllText()
}

function readAllText(){
    let content = document.body.innerText
    speech = new SpeechSynthesisUtterance(content)
    speech.lang = 'nl-NL'

    window.speechSynthesis.speak(speech)
}

function cancelSpeech(){
    if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
        }
}

function makeSpeechButton(){
    let buttonContainer = document.createElement("div")
    let button = document.createElement("p")
    button.textContent = "Voorlezen"
    button.setAttribute("aria-label", "Voorlezen")
    button.setAttribute("id", "screen-reader-button")
    button.classList.add("screen-reader-button")
    buttonContainer.classList.add("screen-reader-button-container")
    buttonContainer.append(button)
    document.body.append(buttonContainer)
}